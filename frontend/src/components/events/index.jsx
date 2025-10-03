import { useNavigate } from "react-router-dom";
import Hero from "../hero";
import { FaSearch, FaEye } from "react-icons/fa";
import { useState, useEffect } from "react";
import Dropdown from "./dropdown";
import Pagination from "./pagination";

const EventDetail = ({ events }) => {
  const Navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [filteredEvents, setFilteredEvents] = useState(events);
  const itemsPerPage = 8;

  useEffect(() => {
    const results = events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredEvents(results);
    setCurrentPage(1);
  }, [searchText, selectedCategory, events]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const getEventStatus = (eventDate, eventTime) => {
    const now = new Date();
    const eventDateTime = new Date(eventDate);
    if (eventTime) {
      const [hours, minutes] = eventTime.split(":");
      eventDateTime.setHours(hours, minutes, 0, 0);
    }
    return now > eventDateTime ? "Closed" : "Upcoming";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-500";
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
    <div className="bg-white">
      <Hero />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Events List</h2>
          <div className="flex flex-col sm:flex-col sm:items-center sm:gap-6 gap-3 mt-4 sm:mt-0">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-10 w-full border rounded-md py-2 px-3 text-gray-700"
                />
              </div>
              <Dropdown
                options={["All Categories", "Concert", "Meetup", "Festival", "Workshop", "Other"]}
                selected={selectedCategory}
                setSelected={(val) => setSelectedCategory(val)}
              />
            </div>
<div className="flex flex-row flex-wrap gap-4 sm:gap-6 mt-2 sm:mt-0">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span>Upcoming</span>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                    <span>Closed</span>
                  </div>
                </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentEvents.length > 0 ? (
            currentEvents.map((product) => {
              const status = getEventStatus(product.date, product.time);
              return (
                <div key={product._id} className="group relative flex flex-col border border-gray-300 rounded-lg shadow-sm hover:shadow-lg hover:border-black transition duration-200">
                  <img
                    alt={product.imageAlt}
                    src={product.image}
                    className="aspect-square w-full rounded-t-lg bg-gray-200 object-cover group-hover:opacity-90 lg:aspect-auto lg:h-60"
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-black">{product.title}</h3>
                      <span className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} title={status}></span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{product.description}</p>
                    <div className="mt-auto">
                      <button
                        onClick={() => handleClick(product._id)}
                        disabled={status === "Closed"}
                        className={`border-[1px] rounded-[15px] w-full h-[46px] flex items-center justify-center gap-2 ${status === "Closed"
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "text-[#6B7280] hover:bg-gray-100 cursor-pointer"
                          }`}
                      >
                        <FaEye /> View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 col-span-full text-center">No events found.</p>
          )}
        </div>

        <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default EventDetail;
