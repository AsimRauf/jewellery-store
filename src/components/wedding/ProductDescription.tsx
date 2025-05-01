interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  if (!description) return null;
  
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-cinzel mb-4">Product Description</h2>
      <div className="prose max-w-none">
        {description.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
    </div>
  );
}