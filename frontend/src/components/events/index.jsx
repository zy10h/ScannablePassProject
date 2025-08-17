import { useNavigate } from "react-router-dom";

const EventDetail = ({ events }) => {
  const Navigate = useNavigate();
  const handleClick = (id) => {
    Navigate(`/event-details/${id}`);
  };
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Events List
        </h2>

        <div className="border-t-2 border-black mt-4 pt-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {events.map((product) => (
              <div
                key={product._id}
                onClick={() => handleClick(product._id)}
                className="cursor-pointer group relative block border border-gray-300 rounded-lg shadow-sm hover:shadow-lg hover:border-black transition duration-200"
              >
                <img
                  alt={product.imageAlt}
                  src={product.image}
                  className="aspect-square w-full rounded-t-lg bg-gray-200 object-cover group-hover:opacity-90 lg:aspect-auto lg:h-60"
                />
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-black">
                    {product.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
