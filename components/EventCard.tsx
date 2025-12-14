import Link from 'next/link'
import Image from 'next/image'

interface Props{
  slug: string;
  image: string;
  title: string;
  location: string;
  date: string;
  time: string;
}


const EventCard = ({title, image, slug, location, date, time} : Props) => {
  return (
    <Link href={`/events/${slug}`} className='event-card'>
      <Image src={image} alt={title} className='poster' height={300} width={410} />

      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="location" height={14} width={14} />
        <p>{location}</p>
      </div>

      <p className='title'>{title}</p>

      <div className='datetime flex flex-row gap-2'>
        <div className='flex flex-row gap-2'>
          <Image src="/icons/calendar.svg" alt="date" height={14} width={14} />
          <p>{date}</p>
        </div>

        <div className='flex flex-row gap-2'>
          <Image src="/icons/clock.svg" alt="time" height={14} width={14} />
          <p>{time}</p>
        </div>
      </div>

    </Link>
  )
}

export default EventCard
