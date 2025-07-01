import Image from 'next/image';
import { CartItem } from '@/types/cart';
import { getCartItemTitle } from '@/utils/product-helper';

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
          {item.customization?.isCustomized && item.customization.customizationType === 'setting-diamond' && item.customization.customizationDetails?.setting && item.customization.customizationDetails?.stone && 'Custom Diamond Ring'}
          {item.customization?.isCustomized && item.customization.customizationType === 'setting-gemstone' && item.customization.customizationDetails?.setting && item.customization.customizationDetails?.stone && 'Custom Gemstone Ring'}
          {item.customization?.isCustomized && item.customization.customizationType === 'preset' && 'Pre-set Ring'}
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
      </div>
    );
  };

  return (
    <div className="flex items-start py-4 border-b border-gray-200 last:border-0">
      <div className="flex space-x-4 flex-1">
        {/* Primary Image */}
        <div className="w-20 h-20 relative flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={item.image}
            alt={getCartItemTitle(item)}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        {/* Stone Image for Custom Items (Diamond or Gemstone) */}
        {item.customization?.isCustomized && item.customization.customizationDetails?.stone && (
          <div className="w-16 h-16 relative flex-shrink-0 mt-1 rounded-lg overflow-hidden">
            <Image
              src={item.customization.customizationDetails.stone.image || '/images/stone-placeholder.jpg'}
              alt={`${item.customization.customizationDetails.stone.type} ${item.customization.customizationDetails.stone.carat}ct`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">{getCartItemTitle(item)}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {item.metalOption && `${item.metalOption.karat} ${item.metalOption.color}`}
            {item.size && ` • Size ${item.size}`}
            {sizeOption && sizeOption.additionalPrice > 0 && 
              ` (+$${sizeOption.additionalPrice.toFixed(2)})`}
            {item.quantity > 1 && ` • Qty: ${item.quantity}`}
          </p>
          
          {renderCustomizationDetails()}
          
          <p className="text-sm font-medium mt-2 text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
