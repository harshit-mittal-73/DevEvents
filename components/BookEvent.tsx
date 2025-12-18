"use client"
import { createBooking } from '@/lib/actions/booking.actions';
import posthog from 'posthog-js';
import { useState } from 'react';

const BookEvent = ({eventId, slug}: {eventId: string, slug: string}) => {

    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    // 1. Add state for error messages
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e : React.FormEvent) => {
      e.preventDefault();
      // 2. Clear previous errors before new request
      setErrorMessage('');

      const {success, error} = await createBooking({eventId, slug, email});

      if(success){
        setSubmitted(true);
        posthog.capture('event-booked', {eventId, slug, email})
      }
      else{
        console.error('Booking creation failed')
        // 3. Set the error message to display to user
        setErrorMessage(error || 'Something went wrong. Please try again.');
        posthog.captureException(error);
      }
    }

  return (
    <div id="book-event">
      {
        submitted ? (
            <p className='text-sm'>Thank you for signing up!</p>
        ) : (
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email Address</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        placeholder="Enter your email address" 
                        />

                    <button type="submit" className='button-submit'>Submit</button>
                    
                    {/* 4. Display the error message if it exists */}
                    {errorMessage && (
                        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                    )}
                </div>
            </form>
        )
      }
    </div>
  )
}

export default BookEvent