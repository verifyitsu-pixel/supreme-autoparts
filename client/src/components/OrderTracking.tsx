import { Package, Truck, CheckCircle, Clock } from "lucide-react";

interface OrderTrackingProps {
  status: "pending" | "processing" | "shipped" | "delivered";
  orderDate: string;
  estimatedDelivery?: string;
}

export function OrderTracking({ status, orderDate, estimatedDelivery }: OrderTrackingProps) {
  const steps = [
    { id: "pending", label: "Order Placed", icon: Package },
    { id: "processing", label: "Processing", icon: Clock },
    { id: "shipped", label: "Shipped", icon: Truck },
    { id: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === status);

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="relative">
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                    isCompleted
                      ? "bg-[#E42933] text-white shadow-lg"
                      : "bg-gray-200 text-gray-400"
                  } ${isCurrent ? "ring-2 ring-[#E42933] ring-offset-2" : ""}`}
                >
                  <Icon size={24} />
                </div>
                <p
                  className={`text-xs font-semibold text-center ${
                    isCompleted ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Connection Line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div
            className="h-full bg-[#E42933] transition-all"
            style={{
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Status Details */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-blue-900 uppercase tracking-widest mb-1">
              Order Date
            </p>
            <p className="text-sm font-semibold text-blue-900">{orderDate}</p>
          </div>
          {estimatedDelivery && (
            <div>
              <p className="text-xs font-semibold text-blue-900 uppercase tracking-widest mb-1">
                Estimated Delivery
              </p>
              <p className="text-sm font-semibold text-blue-900">{estimatedDelivery}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          {status === "pending" && "Your order has been received and is being prepared."}
          {status === "processing" && "Your order is being processed and will be shipped soon."}
          {status === "shipped" && "Your order is on its way! Track your shipment for more details."}
          {status === "delivered" && "Your order has been delivered. Thank you for your purchase!"}
        </p>
      </div>
    </div>
  );
}
