interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  if (!description) {
    return (
      <div className="text-gray-500 italic text-center py-4">
        No product description available.
      </div>
    );
  }
  
  return (
    <div className="prose prose-amber max-w-none">
      {description.split('\n').map((paragraph, index) => (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
}