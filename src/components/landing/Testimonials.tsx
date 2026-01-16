import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Dr. Sarah Mitchell',
      role: 'Cardiologist',
      organization: 'Heart Care Clinic',
      avatar: 'SM',
      content: "MediConnect has transformed how I manage my practice. The patient records system is intuitive, and the AI-assisted insights help me provide better care. My efficiency has improved by 40%.",
      rating: 5,
    },
    {
      name: 'James Rodriguez',
      role: 'Patient',
      organization: '',
      avatar: 'JR',
      content: "Finally, a healthcare platform that puts patients first! I can easily access my medical history, schedule appointments, and even chat with my doctor. The telemedicine feature saved me countless trips.",
      rating: 5,
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Family Medicine',
      organization: 'Family Health Partners',
      avatar: 'MC',
      content: "The seamless integration between scheduling, records, and billing has made running my practice so much easier. The support team is incredibly responsive and helpful.",
      rating: 5,
    },
    {
      name: 'Emily Watson',
      role: 'Practice Manager',
      organization: 'Metro Health Group',
      avatar: 'EW',
      content: "We switched to MediConnect for our 12-doctor practice and the transition was smooth. The reporting features and patient engagement tools have significantly improved our operations.",
      rating: 5,
    },
    {
      name: 'Robert Kim',
      role: 'Patient',
      organization: '',
      avatar: 'RK',
      content: "As someone managing a chronic condition, having all my prescriptions, lab results, and appointments in one place is life-changing. The medication reminders are a game-changer.",
      rating: 5,
    },
    {
      name: 'Dr. Lisa Thompson',
      role: 'Pediatrician',
      organization: 'Children\'s Wellness Center',
      avatar: 'LT',
      content: "Parents love being able to access their children's vaccination records and growth charts anytime. The platform makes my job easier and patients happier.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mb-6">
            <Star className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Trusted by Healthcare{' '}
            <span className="gradient-text">Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See what doctors, patients, and healthcare administrators are saying about MediConnect.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-primary/20 mb-4" />
              
              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-12 h-12 rounded-full gradient-bg-hero flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                    {testimonial.organization && ` • ${testimonial.organization}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
