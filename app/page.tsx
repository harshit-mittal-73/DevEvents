import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/constants";

const page = () => {
  return (
    <>
    <section>
      <h1 className="text-center">
        The Hub For Every Dev <br/> Event You Can't Miss
      </h1>
      <p className="text-center mt-5">Hackathons, Meetups, Conferences, All in One Place</p>
    </section>
    <ExploreBtn/>

    <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>

      <ul className="events list-none">
        {events.map((event) => (
            <li key={event.title}> <EventCard {...event} /> </li>
        ))}
      </ul>
    </div>
    </>
  )
}

export default page