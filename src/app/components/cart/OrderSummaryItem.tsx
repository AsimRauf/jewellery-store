import Image from 'next/image';
import { CartItem } from '@/types/cart';

interface OrderSummaryItemProps {
  item: CartItem;
  sizeOption?: { size: number; additionalPrice: number } | null;
}

export default function OrderSummaryItem({ item, sizeOption }: OrderSummaryItemProps) {
  const renderCustomizationDetails = () => {
    if (!item.customization?.isCustomized) return null;

    return (
      <div className="mt-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
          {item.customization.customizationType === 'setting-diamond' && 'Custom Diamond Ring'}
          {item.customization.customizationType === 'setting-gemstone' && 'Custom Gemstone Ring'}
          {item.customization.customizationType === 'preset' && 'Pre-set Ring'}
        </span>

        {item.customization.customizationDetails && (
          <div className="mt-2 space-y-1 text-xs text-gray-600">
            {item.customization.customizationDetails.stone && (
              <div>
                <span className="font-medium">Stone: </span>
                {item.customization.customizationDetails.stone.type}{' '}
                {item.customization.customizationDetails.stone.carat}ct
                {item.customization.customizationDetails.stone.color && 
                  `, ${item.customization.customizationDetails.stone.color}`}
                {item.customization.customizationDetails.stone.clarity && 
                  `, ${item.customization.customizationDetails.stone.clarity}`}
                {item.customization.customizationDetails.stone.cut && 
                  `, ${item.customization.customizationDetails.stone.cut}`}
              </div>
            )}
            {item.customization.customizationDetails.setting && (
              <div>
                <span className="font-medium">Setting: </span>
                {item.customization.customizationDetails.setting.style}{' '}
                {item.customization.customizationDetails.setting.settingType} in{' '}
                {item.customization.customizationDetails.setting.metalType}
              </div>
            )}
          </div>
        )}

        {item.customization.notes && (
          <p className="mt-1 italic text-gray-500">{item.customization.notes}</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex py-3 border-b border-gray-200 last:border-0">
      <div className="w-16 h-16 relative flex-shrink-0">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="64px"
          className="object-cover rounded-md"
        />
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium">{item.title}</h3>
        <p className="text-xs text-gray-500">
          {item.metalOption && `${item.metalOption.karat} ${item.metalOption.color}`}
          {item.size && ` • Size ${item.size}`}
          {sizeOption && sizeOption.additionalPrice > 0 && 
            ` (+$${sizeOption.additionalPrice.toFixed(2)})`}
          {item.quantity > 1 && ` • Qty: ${item.quantity}`}
        </p>
        
        {renderCustomizationDetails()}
        
        <p className="text-sm font-medium mt-1">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
}