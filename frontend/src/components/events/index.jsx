import { useNavigate } from "react-router-dom";
import Hero from "../hero";
import InputField from "../textfield";
import { FormProvider, useForm } from "react-hook-form";
import { FaSearch, FaEye } from "react-icons/fa";
import { useState } from "react";
import Dropdown from "./dropdown";
import Pagination from "./pagination";
import { EVENTS } from "../constants";

const EventDetail = ({events}) => {
  const Navigate = useNavigate();
  const methods = useForm();
  const onSubmit = (data) => {
    console.log("search Data:", data);
  };

  // const events = EVENTS

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const itemsPerPage = 8;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEvents = events.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-500";
      case "Pending":
        return "bg-black";
      case "Closed":
        return "bg-gray-400";
      default:
        return "bg-gray-300";
    }
  };

  const handleClick = (id) => {
    Navigate(`/event-details/${id}`);
  };

  return (
    <>
      <style>{`
        @media (max-width: 700px) {
          .heading-potion {
            flex-direction: row !important;
          }
        }
      `}</style>
      <FormProvider {...methods}>
        <div className="bg-white">
          <Hero />
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Events List
              </h2>

              <div className="heading-potion flex flex-col sm:flex-col sm:items-center sm:gap-6 gap-3 mt-4 sm:mt-0">
                <form
                  onSubmit={methods.handleSubmit(onSubmit)}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
                >
                  <div className="relative w-full sm:w-64">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <InputField
                      name="name"
                      type="text"
                      placeholder="Search..."
                      rules={{ required: false }}
                      className="pl-10 w-full"
                    />
                  </div>

                  <Dropdown
                    options={[
                      "All Categories",
                      "Concert",
                      "Meetup",
                      "Festival",
                      "Workshop",
                      "Other",
                    ]}
                    selected={selectedCategory}
                    setSelected={setSelectedCategory}
                  />
                </form>

                <div className="flex flex-row flex-wrap gap-4 sm:gap-6 mt-2 sm:mt-0">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span>Upcoming</span>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <span className="w-3 h-3 rounded-full bg-black"></span>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 xl:gap-x-8">
              {currentEvents.map((product) => (
                <div
                  key={product._id}
                  className="group relative block border border-gray-300 rounded-lg shadow-sm hover:shadow-lg hover:border-black transition duration-200"
                >
                  <img
                    alt={product.imageAlt}
                    src={product.image}
                    className="aspect-square w-full rounded-t-lg bg-gray-200 object-cover group-hover:opacity-90 lg:aspect-auto lg:h-60"
                  />

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-black">
                        {product.title}
                      </h3>
                      <span
                        className={`w-3 h-3 rounded-full ${getStatusColor(
                          product.status
                        )}`}
                      ></span>
                    </div>

                    <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                      {product.description}
                    </p>

                    <button
                      onClick={() => handleClick(product._id)}
                      className="border-[1px] text-[#6B7280] rounded-[15px] w-[230px] h-[46px] mt-2 flex items-center justify-center gap-2"
                    >
                      <FaEye /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </FormProvider>
    </>
  );
};

export default EventDetail;
