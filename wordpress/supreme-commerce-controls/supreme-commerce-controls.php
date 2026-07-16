<?php
/**
 * Plugin Name: Supreme Autoparts Commerce Controls
 * Description: Pesapal and TransactPay gateway settings, customer policy pages, and required checkout acknowledgements.
 * Version: 1.0.0
 * Author: Supreme Autoparts
 */
if (!defined('ABSPATH')) exit;

add_action('plugins_loaded', function () {
  if (!class_exists('WC_Payment_Gateway')) return;

  class Supreme_Pesapal_Gateway extends WC_Payment_Gateway {
    public function __construct() {
      $this->id = 'supreme_pesapal';
      $this->method_title = 'Pesapal';
      $this->method_description = 'Pesapal API 3.0 hosted checkout for cards and mobile money.';
      $this->has_fields = false;
      $this->supports = ['products', 'refunds'];
      $this->init_form_fields(); $this->init_settings();
      $this->title = $this->get_option('title', 'Pesapal');
      $this->description = $this->get_option('description', 'Pay securely using Pesapal. Available methods are shown on the hosted payment page.');
      $this->enabled = $this->get_option('enabled', 'no');
      add_action('woocommerce_update_options_payment_gateways_'.$this->id, [$this, 'process_admin_options']);
      add_action('woocommerce_api_supreme_pesapal', [$this, 'callback']);
    }
    public function init_form_fields() {
      $this->form_fields = [
        'enabled'=>['title'=>'Enable Pesapal','type'=>'checkbox','label'=>'Enable Pesapal checkout','default'=>'no'],
        'title'=>['title'=>'Checkout title','type'=>'text','default'=>'Pesapal'],
        'description'=>['title'=>'Customer description','type'=>'textarea','default'=>'Pay securely by card or mobile money through Pesapal.'],
        'environment'=>['title'=>'Environment','type'=>'select','default'=>'sandbox','options'=>['sandbox'=>'Sandbox','live'=>'Live']],
        'consumer_key'=>['title'=>'Consumer key','type'=>'password'],
        'consumer_secret'=>['title'=>'Consumer secret','type'=>'password'],
      ];
    }
    private function base() { return $this->get_option('environment') === 'live' ? 'https://pay.pesapal.com/v3' : 'https://cybqa.pesapal.com/pesapalv3'; }
    private function request($path, $body=[], $token='') {
      $headers=['Accept'=>'application/json','Content-Type'=>'application/json']; if($token) $headers['Authorization']='Bearer '.$token;
      $r=wp_remote_post($this->base().$path,['timeout'=>45,'headers'=>$headers,'body'=>wp_json_encode($body)]);
      if(is_wp_error($r)) throw new Exception($r->get_error_message());
      $data=json_decode(wp_remote_retrieve_body($r),true); if(wp_remote_retrieve_response_code($r)>=300) throw new Exception($data['message']??'Pesapal request failed'); return $data;
    }
    private function token() { $r=$this->request('/api/Auth/RequestToken',['consumer_key'=>$this->get_option('consumer_key'),'consumer_secret'=>$this->get_option('consumer_secret')]); return $r['token']??''; }
    public function process_payment($order_id) {
      try {
        $order=wc_get_order($order_id); $token=$this->token(); if(!$token) throw new Exception('Pesapal authentication failed.');
        $ipn=$this->request('/api/URLSetup/RegisterIPN',['url'=>WC()->api_request_url('supreme_pesapal'),'ipn_notification_type'=>'GET'],$token);
        $payload=['id'=>(string)$order->get_order_number(),'currency'=>$order->get_currency(),'amount'=>(float)$order->get_total(),'description'=>'Supreme Autoparts order '.$order->get_order_number(),'callback_url'=>$this->get_return_url($order),'notification_id'=>$ipn['ipn_id']??'','billing_address'=>['email_address'=>$order->get_billing_email(),'phone_number'=>$order->get_billing_phone(),'first_name'=>$order->get_billing_first_name(),'middle_name'=>'','last_name'=>$order->get_billing_last_name(),'line_1'=>$order->get_billing_address_1(),'line_2'=>$order->get_billing_address_2(),'city'=>$order->get_billing_city(),'state'=>$order->get_billing_state(),'postal_code'=>$order->get_billing_postcode(),'country_code'=>$order->get_billing_country()]];
        $response=$this->request('/api/Transactions/SubmitOrderRequest',$payload,$token); if(empty($response['redirect_url'])) throw new Exception('Pesapal did not return a checkout URL.');
        $order->update_status('pending','Customer redirected to Pesapal.'); return ['result'=>'success','redirect'=>$response['redirect_url']];
      } catch(Throwable $e) { wc_add_notice('Pesapal is temporarily unavailable: '.$e->getMessage(),'error'); return ['result'=>'failure']; }
    }
    public function callback() {
      $tracking=sanitize_text_field($_GET['OrderTrackingId']??''); $merchant=sanitize_text_field($_GET['OrderMerchantReference']??'');
      $order=wc_get_order($merchant); if($order && $tracking){$order->update_meta_data('_pesapal_tracking_id',$tracking);$order->save();}
      status_header(200); echo 'OK'; exit;
    }
    public function process_refund($order_id,$amount=null,$reason='') { return new WP_Error('pesapal-refund-manual','Submit the refund from the Pesapal merchant dashboard, then record the refund in WooCommerce.'); }
  }

  class Supreme_TransactPay_Gateway extends WC_Payment_Gateway {
    public function __construct(){
      $this->id='supreme_transactpay';$this->method_title='TransactPay';$this->method_description='TransactPay merchant gateway. Enable only after vendor endpoint and credentials are supplied.';$this->has_fields=false;$this->supports=['products'];
      $this->init_form_fields();$this->init_settings();$this->enabled=$this->get_option('enabled','no');$this->title=$this->get_option('title','TransactPay');$this->description=$this->get_option('description','Pay securely through TransactPay.');
      add_action('woocommerce_update_options_payment_gateways_'.$this->id,[$this,'process_admin_options']);
    }
    public function init_form_fields(){ $this->form_fields=['enabled'=>['title'=>'Enable TransactPay','type'=>'checkbox','label'=>'Enable only after credentials are verified','default'=>'no'],'title'=>['title'=>'Checkout title','type'=>'text','default'=>'TransactPay'],'description'=>['title'=>'Customer description','type'=>'textarea','default'=>'Secure card payment through TransactPay.'],'merchant_id'=>['title'=>'Merchant ID','type'=>'password'],'api_key'=>['title'=>'API key','type'=>'password'],'checkout_endpoint'=>['title'=>'Vendor checkout endpoint','type'=>'url','description'=>'Use the exact hosted-checkout endpoint supplied by TransactPay.']]; }
    public function is_available(){return parent::is_available() && (bool)$this->get_option('merchant_id') && (bool)$this->get_option('api_key') && filter_var($this->get_option('checkout_endpoint'),FILTER_VALIDATE_URL);}
    public function process_payment($order_id){wc_add_notice('TransactPay requires the merchant-specific integration specification before live transactions can be accepted.','error');return ['result'=>'failure'];}
  }
  add_filter('woocommerce_payment_gateways',function($g){$g[]='Supreme_Pesapal_Gateway';$g[]='Supreme_TransactPay_Gateway';return $g;});
});

function supreme_policy_pages(){
  $pages=[
    'auto-parts'=>['Used Auto Parts','[products limit="24" columns="4" paginate="true"]'],
    'engine'=>['Used Engines','[products category="engines" limit="24" columns="4" paginate="true"]'],
    'transmission'=>['Used Transmissions','[products category="transmissions" limit="24" columns="4" paginate="true"]'],
    'about-us'=>['About Supreme Autoparts','Supreme Autoparts helps customers source quality used engines, transmissions and vehicle components. Our team verifies fitment using the vehicle year, make, model, engine and VIN before fulfillment.'],
    'track-order'=>['Track My Order','[woocommerce_order_tracking]'],
    'submit-ticket'=>['Submit a Ticket','For order, payment, delivery, warranty or return support, email calvin@supremeautoparts.co.ke or call 0714 498 451. Include your order number and vehicle details.'],
    'testimonials'=>['Customer Testimonials','Customer feedback and verified purchase reviews are displayed here as they are received.'],
    'blog'=>['Supreme Autoparts Resources','Vehicle fitment, installation, maintenance and parts-buying resources from Supreme Autoparts.'],
    'terms-and-conditions'=>['Terms and Conditions','Orders are subject to vehicle-fitment verification, product availability, payment authorization, and these terms. Customers must provide accurate vehicle year, make, model, engine and VIN details. Used components may show normal cosmetic wear. Installation must be performed by a qualified technician. Fraudulent transactions, abusive disputes, and misuse of the chargeback process may be contested with order, delivery and communication evidence. Nothing in these terms limits rights that cannot lawfully be excluded.'],
    'refund-and-chargeback-policy'=>['Refund, Cancellation and Chargeback Policy','Contact Supreme Autoparts before returning any item or opening a payment dispute. Approved returns require a return authorization and must be sent in the condition received. Refund timing depends on inspection and the original payment method. Shipping, diagnostic, programming, labor and installation costs are not refundable unless required by law. Duplicate, unauthorized or incorrect charges should be reported immediately to calvin@supremeautoparts.co.ke or 0714 498 451. We investigate chargebacks and provide the payment processor with order, consent, delivery and support records.'],
    'warranty-and-return'=>['Warranty and Returns','Warranty coverage, duration and exclusions are stated on the product or quotation. Coverage applies to the supplied component only unless expressly stated otherwise. Keep invoices, installation records and diagnostic reports. Do not dismantle, modify or return a component without authorization. Claims must include the order number, VIN, installer details, fault codes and supporting photographs where relevant.'],
    'shipping-payment-policy'=>['Delivery and Payment','Delivery estimates begin after payment and fitment verification. Freight orders require a safe commercial delivery point or prior lift-gate arrangement. Inspect shipments before signing and record visible damage with the carrier. Payments are processed by the gateway selected at checkout; Supreme Autoparts does not store complete card numbers.'],
    'privacy-policy'=>['Privacy Policy','We use customer and vehicle information to verify fitment, process orders, prevent fraud, provide support and meet legal obligations. Payment credentials are handled by the selected payment provider. We share only the information required with processors, carriers and service providers. Contact calvin@supremeautoparts.co.ke to request access, correction or deletion where applicable.'],
    'faq'=>['Frequently Asked Questions','Before ordering, have your VIN, year, make, model, engine size and required part ready. Availability and price may change until an order is confirmed. Contact 0714 498 451 or calvin@supremeautoparts.co.ke for fitment, delivery, warranty or payment help.'],
    'contact-us'=>['Contact Us','For sales, fitment, payment, delivery, refund or warranty assistance, email calvin@supremeautoparts.co.ke or call 0714 498 451. Include your order number and vehicle details when contacting support.'],
  ];
  foreach($pages as $slug=>$page){if(!get_page_by_path($slug)){wp_insert_post(['post_type'=>'page','post_status'=>'publish','post_name'=>$slug,'post_title'=>$page[0],'post_content'=>'<!-- wp:paragraph --><p>'.esc_html($page[1]).'</p><!-- /wp:paragraph -->']);}}
  foreach(['engines'=>'Engines','transmissions'=>'Transmissions','auto-parts'=>'Auto Parts'] as $slug=>$name){if(!term_exists($slug,'product_cat'))wp_insert_term($name,'product_cat',['slug'=>$slug]);}
  $terms=get_page_by_path('terms-and-conditions'); if($terms) update_option('woocommerce_terms_page_id',$terms->ID);
}
add_action('init','supreme_policy_pages',20);

function supreme_register_brand_taxonomy(){
  if(!taxonomy_exists('product_brand')) register_taxonomy('product_brand','product',['hierarchical'=>true,'labels'=>['name'=>'Brands','singular_name'=>'Brand'],'show_ui'=>true,'show_admin_column'=>true,'show_in_rest'=>true,'rewrite'=>['slug'=>'brand']]);
}
add_action('init','supreme_register_brand_taxonomy',5);

function supreme_import_catalog_image($file,$title){
  $source=ABSPATH.'assets/exact/'.$file; if(!is_readable($source)) return 0;
  $upload=wp_upload_bits('supreme-'.sanitize_title($title).'.png',null,file_get_contents($source)); if(!empty($upload['error'])) return 0;
  $id=wp_insert_attachment(['post_mime_type'=>'image/png','post_title'=>$title,'post_status'=>'inherit'],$upload['file']);
  if($id){require_once ABSPATH.'wp-admin/includes/image.php';wp_update_attachment_metadata($id,wp_generate_attachment_metadata($id,$upload['file']));} return $id;
}

function supreme_seed_catalog(){
  update_option('woocommerce_coming_soon','no'); update_option('woocommerce_store_pages_only','no');
  if(get_option('supreme_catalog_seed_v1')) return;
  if(!class_exists('WC_Product_Simple')) return;
  $categories=['engines'=>'Engines','transmissions'=>'Transmissions','drivetrain'=>'Drivetrain','electrical'=>'Electrical','steering-suspension'=>'Steering & Suspension','body-parts'=>'Body Parts','brakes'=>'Brakes'];
  $cat_ids=[];foreach($categories as $slug=>$name){$term=term_exists($slug,'product_cat');if(!$term)$term=wp_insert_term($name,'product_cat',['slug'=>$slug]);$cat_ids[$slug]=is_array($term)?(int)$term['term_id']:(int)$term;}
  $brands=['Toyota','Honda','Ford','Chevrolet','Nissan','BMW','Mercedes-Benz','Hyundai','Kia','Subaru','Volkswagen','Land Rover'];
  $brand_ids=[];foreach($brands as $brand){$term=term_exists($brand,'product_brand');if(!$term)$term=wp_insert_term($brand,'product_brand');$brand_ids[$brand]=is_array($term)?(int)$term['term_id']:(int)$term;}
  $images=['engines'=>'b4fc077bbe8e0fcc.png','transmissions'=>'4b233f8c949ae91c.png','drivetrain'=>'f68ad73a9e5807c2.png','electrical'=>'c0a612821667b6dc.png','steering-suspension'=>'e138d1ff66af22f6.png','body-parts'=>'c3c4900faa382fc5.png','brakes'=>'afc5dfac18e5e021.png'];
  $image_ids=[];foreach($images as $key=>$file)$image_ids[$key]=supreme_import_catalog_image($file,$categories[$key]);
  $products=[
    ['Toyota Fitment-Verified Used Engine Assembly','SUP-ENG-TOY',2495,'engines','Toyota'],['Honda Low-Mileage Used Engine Assembly','SUP-ENG-HON',2295,'engines','Honda'],['Ford Remanufactured Engine Assembly','SUP-ENG-FOR',3195,'engines','Ford'],
    ['Chevrolet Automatic Transmission Assembly','SUP-TRN-CHV',1895,'transmissions','Chevrolet'],['Nissan CVT Transmission Assembly','SUP-TRN-NIS',1695,'transmissions','Nissan'],['BMW Automatic Transmission Assembly','SUP-TRN-BMW',2795,'transmissions','BMW'],
    ['Mercedes-Benz Rear Differential Assembly','SUP-DIF-MBZ',995,'drivetrain','Mercedes-Benz'],['Land Rover Transfer Case Assembly','SUP-TCF-LR',1195,'drivetrain','Land Rover'],['Subaru Front Axle Assembly','SUP-AXL-SUB',795,'drivetrain','Subaru'],
    ['Hyundai Alternator Assembly','SUP-ALT-HYU',285,'electrical','Hyundai'],['Kia Starter Motor Assembly','SUP-STR-KIA',245,'electrical','Kia'],['Volkswagen Steering Rack Assembly','SUP-STG-VW',625,'steering-suspension','Volkswagen'],
  ];
  foreach($products as [$name,$sku,$price,$category,$brand]){
    if(wc_get_product_id_by_sku($sku))continue;$p=new WC_Product_Simple();$p->set_name($name);$p->set_slug(sanitize_title($name));$p->set_sku($sku);$p->set_status('publish');$p->set_catalog_visibility('visible');$p->set_regular_price((string)$price);$p->set_price((string)$price);$p->set_stock_status('instock');$p->set_manage_stock(false);$p->set_category_ids([$cat_ids[$category]]);$p->set_image_id($image_ids[$category]??0);$p->set_short_description('Quality-inspected replacement component. Vehicle year, make, model and VIN are verified before fulfillment.');$p->set_description('This catalog entry represents a fitment-specific component. Mileage, interchange, warranty and delivery details are confirmed against your vehicle information before shipment. Product images are representative; the supplied unit may vary cosmetically. Professional installation is required.');$id=$p->save();if($id&&!empty($brand_ids[$brand]))wp_set_object_terms($id,[$brand_ids[$brand]],'product_brand');
  }
  update_option('supreme_catalog_seed_v1',current_time('mysql'));
  if(!get_option('woocommerce_cod_settings'))update_option('woocommerce_cod_settings',['enabled'=>'yes','title'=>'Pay after fitment confirmation','description'=>'Place the order now. Our team will confirm fitment and contact you before payment or dispatch.','instructions'=>'Your order is awaiting fitment confirmation.']);
}
add_action('init','supreme_seed_catalog',30);

add_action('woocommerce_before_add_to_cart_button',function(){echo '<fieldset class="supreme-fitment"><legend>Confirm vehicle fitment</legend><p><label>Vehicle year <input required name="fitment_year" inputmode="numeric" maxlength="4"></label><label>Make <input required name="fitment_make"></label></p><p><label>Model <input required name="fitment_model"></label><label>VIN (recommended) <input name="fitment_vin" maxlength="17"></label></p><small>We verify these details before fulfillment.</small></fieldset>';});
add_filter('woocommerce_add_to_cart_validation',function($valid){foreach(['fitment_year'=>'vehicle year','fitment_make'=>'make','fitment_model'=>'model'] as $key=>$label)if(empty($_POST[$key])){wc_add_notice('Please enter the '.$label.' for fitment verification.','error');$valid=false;}return $valid;},10,1);
add_filter('woocommerce_add_cart_item_data',function($data){foreach(['fitment_year'=>'Vehicle year','fitment_make'=>'Make','fitment_model'=>'Model','fitment_vin'=>'VIN'] as $key=>$label)if(!empty($_POST[$key]))$data['supreme_'.$key]=sanitize_text_field($_POST[$key]);$data['unique_key']=wp_generate_uuid4();return $data;});
add_filter('woocommerce_get_item_data',function($display,$cart){foreach(['fitment_year'=>'Vehicle year','fitment_make'=>'Make','fitment_model'=>'Model','fitment_vin'=>'VIN'] as $key=>$label)if(!empty($cart['supreme_'.$key]))$display[]=['key'=>$label,'value'=>$cart['supreme_'.$key]];return $display;},10,2);
add_action('woocommerce_checkout_create_order_line_item',function($item,$key,$values){foreach(['fitment_year'=>'Vehicle year','fitment_make'=>'Make','fitment_model'=>'Model','fitment_vin'=>'VIN'] as $field=>$label)if(!empty($values['supreme_'.$field]))$item->add_meta_data($label,$values['supreme_'.$field]);},10,3);

add_filter('woocommerce_checkout_fields',function($fields){$fields['billing']['billing_vehicle_year']=['type'=>'text','label'=>'Vehicle year','required'=>true,'class'=>['form-row-first'],'priority'=>125];$fields['billing']['billing_vehicle_make']=['type'=>'text','label'=>'Vehicle make','required'=>true,'class'=>['form-row-last'],'priority'=>126];$fields['billing']['billing_vehicle_model']=['type'=>'text','label'=>'Vehicle model','required'=>true,'class'=>['form-row-first'],'priority'=>127];$fields['billing']['billing_vehicle_vin']=['type'=>'text','label'=>'VIN (recommended)','required'=>false,'class'=>['form-row-last'],'priority'=>128];return $fields;});

add_action('woocommerce_review_order_before_submit',function(){
  echo '<div class="supreme-checkout-reminder"><strong>Before placing your order</strong><p>Confirm your vehicle and delivery details. By ordering, you accept our <a target="_blank" href="'.esc_url(home_url('/terms-and-conditions/')).'">terms</a>, <a target="_blank" href="'.esc_url(home_url('/refund-and-chargeback-policy/')).'">refund and chargeback policy</a>, and <a target="_blank" href="'.esc_url(home_url('/warranty-and-return/')).'">warranty terms</a>.</p>';
  woocommerce_form_field('supreme_policy_accept',['type'=>'checkbox','class'=>['form-row validate-required'],'label_class'=>['woocommerce-form__label-for-checkbox'],'required'=>true,'label'=>'I confirm my order details and accept the refund, chargeback, warranty and terms policies.']); echo '</div>';
},8);
add_action('woocommerce_checkout_process',function(){if(empty($_POST['supreme_policy_accept']))wc_add_notice('Please confirm the refund, chargeback, warranty and terms policies before placing your order.','error');});
add_action('woocommerce_checkout_create_order',function($order){$order->update_meta_data('_supreme_policy_acceptance',current_time('mysql').' | '.sanitize_text_field($_SERVER['REMOTE_ADDR']??''));});
