import React, { useState } from "react";

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Manel Khalsi",
      role: "Cliente",
      image: "👩‍💼",
      text: "Équipe professionnelle toujours disponible et à l'écoute, je recommande les yeux fermés.. Bonne continuation pour vous",
      rating: 5,
      date: "12 janvier 2021"
    },
    {
      id: 2,
      name: "Mar Yem",
      role: "Cliente",
      image: "👩",
      text: "Agence Ameni Immo équipe très efficace et très professionnel. A recommander les yeux fermés ❤️❤️❤️",
      rating: 5,
      date: "28 juillet 2017"
    },
    {
      id: 3,
      name: "Imen Rais",
      role: "Cliente satisfaite",
      image: "👩‍💼",
      text: "Service client très professionnel et personnel accueillant. Très satisfaite de mon expérience avec l'agence.",
      rating: 5,
      date: "23 mai 2017"
    },
    {
      id: 4,
      name: "Oussema Ameni",
      role: "Client",
      image: "👨‍💼",
      text: "تعاملت مع أماني العقارية وماندمتش خاطر الي يقول ameni immo يقول الثقة ويقول المصداقية والنصيحة ويها المناسبة نحب نشكر العاملين الكل فيها وعلى رأسهم سي محمد 👌👌 bravo et bon courage",
      rating: 5,
      date: "29 mai 2018"
    },
    {
      id: 5,
      name: "Abdessalem Khelifi",
      role: "Client",
      image: "👨",
      text: "Recommande AMENI iMo",
      rating: 5,
      date: "14 juin 2017"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Ce que disent nos <span className="gradient-text">Clients</span>
          </h2>
          <p className="text-gray-600 text-lg">Des milliers de clients satisfaits nous font confiance</p>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-4xl shadow-lg">
                          {testimonial.image}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-center md:text-left">
                        {/* Quote Icon */}
                        <svg className="w-12 h-12 text-primary-200 mb-4 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>

                        {/* Text */}
                        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                          {testimonial.text}
                        </p>

                        {/* Rating */}
                        <div className="flex justify-center md:justify-start mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>

                        {/* Author */}
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{testimonial.name}</h4>
                          <p className="text-primary-600 font-medium">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Témoignage précédent"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Témoignage suivant"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none ${
                  index === currentIndex 
                    ? 'bg-primary-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-700 mb-2">90%</div>
            <div className="text-gray-600">Clients satisfaits</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-700 mb-2">22</div>
            <div className="text-gray-600">Avis vérifiés</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-700 mb-2">4.5/5</div>
            <div className="text-gray-600">Note moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-700 mb-2">10+</div>
            <div className="text-gray-600">Années d'expérience</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
