import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import EventDetail from "../components/events";
import Spinner from "../components/spinner";

const EventsListing = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get("/event/getAllEvents");
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <EventDetail events={events} />
    </div>
  );
};

export default EventsListing;
