import React, { useState } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight, FaCamera, FaTimes } from 'react-icons/fa';

const Blog = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    location: '',
    rating: 5,
    review: '',
    images: []
  });

  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai, India",
      rating: 5,
      review: "Amazing experience booking through Tripar! The flight search was so easy and I found the best deals. The customer service was exceptional.",
      images: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400"],
      date: "2024-12-15"
    },
    {
      id: 2,
      name: "Rahul Verma",
      location: "Delhi, India",
      rating: 4,
      review: "Great platform for booking flights. The interface is user-friendly and I love the fare comparison feature. Highly recommended!",
      images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
      date: "2024-12-10"
    },
    {
      id: 3,
      name: "Anita Patel",
      location: "Ahmedabad, India",
      rating: 5,
      review: "Booked my family vacation through Tripar and everything was seamless. From booking to customer support, everything was perfect!",
      images: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400", "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400"],
      date: "2024-12-08"
    },
    {
      id: 4,
      name: "Vikram Singh",
      location: "Bangalore, India",
      rating: 4,
      review: "Love the student fare options! Saved a lot of money on my flight bookings. The app is fast and reliable.",
      images: [],
      date: "2024-12-05"
    }
  ]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newReview.images.length > 3) {
      alert('Maximum 3 images allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewReview(prev => ({
          ...prev,
          images: [...prev.images, event.target.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setNewReview(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitReview = () => {
    if (!newReview.name || !newReview.review) {
      alert('Please fill in all required fields');
      return;
    }

    const review = {
      id: testimonials.length + 1,
      ...newReview,
      date: new Date().toISOString().split('T')[0],
      isUserAdded: true
    };

    setTestimonials([review, ...testimonials]);
    setNewReview({ name: '', location: '', rating: 5, review: '', images: [] });
    setShowAddReview(false);
    alert('Thank you for your review!');
  };

  const handleDeleteReview = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setTestimonials(prev => prev.filter(review => review.id !== id));
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(testimonials.length / 2)) % Math.ceil(testimonials.length / 2));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const visibleTestimonials = testimonials.slice(currentSlide * 2, currentSlide * 2 + 2);

  return (
    <div id="testimonial-section" className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Traveler Stories & Reviews</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover authentic experiences from fellow travelers who chose Tripar for their journey. 
            Read their stories, see their adventures, and get inspired for your next trip!
          </p>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Travelers Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Real experiences from real travelers who trusted Tripar for their journey
            </p>
            <button
              onClick={() => setShowAddReview(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg text-lg"
            >
              Share Your Experience
            </button>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {visibleTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-105">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                    <div className="ml-auto flex items-center">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{testimonial.review}</p>

                  {testimonial.images.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {testimonial.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Travel photo ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                        />
                      ))}
                    </div>
                  )}

                  <div className="text-sm text-gray-400">
                    {new Date(testimonial.date).toLocaleDateString('en-IN')}
                  </div>

                  {testimonial.isUserAdded && (
                    <button
                      onClick={() => handleDeleteReview(testimonial.id)}
                      className="mt-2 text-sm text-red-600 hover:underline"
                    >
                      Delete Review
                    </button>
                  )}
                </div>
              ))}
            </div>

            {testimonials.length > 2 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 text-gray-700 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all"
                >
                  <FaChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 text-gray-700 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all"
                >
                  <FaChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {testimonials.length > 2 && (
            <div className="flex justify-center space-x-2">
              {[...Array(Math.ceil(testimonials.length / 2))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? 'bg-blue-600' : 'bg-gray-300'}`}
                />
              ))}

              
            </div>
          )}
        </div>
      </div>
      {showAddReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full relative">
            <button
              onClick={() => setShowAddReview(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">Share Your Experience</h3>

            <div className="flex gap-4 mb-3">
              <input
                type="text"
                placeholder="Your Name"
                className="flex-1 px-4 py-2 border rounded-lg"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Your Location"
                className="flex-1 px-4 py-2 border rounded-lg"
                value={newReview.location}
                onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
              />
            </div>

            <textarea
              placeholder="Write your review..."
              className="w-full px-4 py-2 mb-3 border rounded-lg"
              value={newReview.review}
              onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
            />

            <label className="block mb-2 font-medium text-gray-700">Rating:</label>
            <div className="flex space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                  className={`cursor-pointer w-6 h-6 ${i < newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>

            <label className="block mb-2 font-medium text-gray-700">Upload up to 3 images:</label>
            <div className="relative mb-4">
              <label className="block w-full text-center px-4 py-2 bg-blue-50 border border-blue-300 rounded-lg text-blue-600 font-medium cursor-pointer hover:bg-blue-100 transition">
                Choose Images
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-2 mb-4">
              {newReview.images.map((image, i) => (
                <div key={i} className="relative w-16 h-16">
                  <img src={image} alt={`Upload ${i}`} className="w-full h-full object-cover rounded-md border" />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSubmitReview}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Blog;
