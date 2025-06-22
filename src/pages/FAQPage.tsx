import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, BookOpen, Users, Clock, Calendar } from 'lucide-react';

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      id: 1,
      title: 'General Information',
      icon: BookOpen,
      color: 'bg-blue-500/10 text-blue-500',
      items: [
        {
          id: 1,
          question: 'What are the sport requirements for students?',
          answer: 'All students must complete a minimum number of sport hours per semester. This includes attending scheduled training sessions, completing fitness tests, and meeting specific physical requirements like push-ups and flexibility exercises.'
        },
        {
          id: 2,
          question: 'How many sport hours do I need to complete?',
          answer: 'Students typically need to complete 2-4 sport hours per week, depending on their program and year of study. Check your specific requirements in the Progress section.'
        },
        {
          id: 3,
          question: 'What happens if I don\'t meet the sport requirements?',
          answer: 'Students who don\'t meet sport requirements may need to complete additional sessions or retake fitness tests. Contact your sport coordinator for specific guidance.'
        }
      ]
    },
    {
      id: 2,
      title: 'Booking & Scheduling',
      icon: Calendar,
      color: 'bg-brand-violet/10 text-brand-violet',
      items: [
        {
          id: 4,
          question: 'How do I book a training session?',
          answer: 'Go to the Schedule page, select your preferred time slot, and click "Book Session". You\'ll receive a confirmation and can add it to your calendar.'
        },
        {
          id: 5,
          question: 'Can I cancel a booked session?',
          answer: 'Yes, you can cancel sessions up to 2 hours before the scheduled time. Go to your booked session and click "Cancel Booking".'
        },
        {
          id: 6,
          question: 'What if a session is full?',
          answer: 'You can join the waiting list for full sessions. If someone cancels, you\'ll be automatically notified and can claim the spot.'
        }
      ]
    },
    {
      id: 3,
      title: 'Fitness Tests',
      icon: Users,
      color: 'bg-green-500/10 text-green-500',
      items: [
        {
          id: 7,
          question: 'What fitness tests do I need to pass?',
          answer: 'Students typically need to complete push-ups, crunches, and flexibility (tilt fingers) tests. Specific requirements vary by program.'
        },
        {
          id: 8,
          question: 'When are fitness tests scheduled?',
          answer: 'Fitness tests are usually scheduled at the beginning and end of each semester. Check the Schedule page for upcoming test dates.'
        },
        {
          id: 9,
          question: 'Can I retake a fitness test if I fail?',
          answer: 'Yes, you can usually retake fitness tests. Contact your instructor to schedule a makeup test.'
        }
      ]
    },
    {
      id: 4,
      title: 'Technical Support',
      icon: Clock,
      color: 'bg-orange-500/10 text-orange-500',
      items: [
        {
          id: 10,
          question: 'I\'m having trouble booking sessions. What should I do?',
          answer: 'Try refreshing the page or clearing your browser cache. If problems persist, contact technical support or your sport coordinator.'
        },
        {
          id: 11,
          question: 'My progress isn\'t updating correctly. How do I fix this?',
          answer: 'Progress updates may take up to 24 hours to reflect. If your progress still isn\'t accurate after this time, please contact support.'
        },
        {
          id: 12,
          question: 'How do I reset my password?',
          answer: 'Use the "Forgot Password" link on the login page, or contact IT support for assistance with account recovery.'
        }
      ]
    }
  ];

  const toggleItem = (itemId: number) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-contrast">Frequently Asked Questions</h1>
        <p className="text-inactive mt-2">Find answers to common questions about the sport program</p>
      </div>

      {/* Search */}
      <div className="innohassle-card p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-inactive" size={20} />
          <input
            type="text"
            placeholder="Search FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-primary border border-secondary rounded-xl text-contrast placeholder-inactive focus:outline-none focus:ring-2 focus:ring-brand-violet/50 focus:border-brand-violet"
          />
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-6">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          
          return (
            <div key={category.id} className="innohassle-card overflow-hidden">
              {/* Category Header */}
              <div className="bg-primary border-b border-secondary px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-contrast">{category.title}</h2>
                    <p className="text-sm text-inactive">{category.items.length} questions</p>
                  </div>
                </div>
              </div>

              {/* FAQ Items */}
              <div className="divide-y divide-secondary">
                {category.items.map((item) => {
                  const isOpen = openItems.includes(item.id);
                  
                  return (
                    <div key={item.id} className="p-6">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full text-left flex items-center justify-between group"
                      >
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="p-1 bg-secondary rounded-full mt-1 flex-shrink-0">
                            <HelpCircle className="text-inactive" size={14} />
                          </div>
                          <h3 className="text-contrast font-medium group-hover:text-brand-violet transition-colors">
                            {item.question}
                          </h3>
                        </div>
                        
                        <div className="ml-4 flex-shrink-0">
                          {isOpen ? (
                            <ChevronUp className="text-inactive group-hover:text-brand-violet transition-colors" size={20} />
                          ) : (
                            <ChevronDown className="text-inactive group-hover:text-brand-violet transition-colors" size={20} />
                          )}
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="mt-4 ml-8 pr-8">
                          <div className="bg-primary/50 rounded-lg p-4 border border-secondary">
                            <p className="text-contrast leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Support */}
      <div className="innohassle-card p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-violet/10 rounded-xl mb-4">
            <HelpCircle className="text-brand-violet" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-contrast mb-2">Still need help?</h3>
          <p className="text-inactive mb-4">
            Can't find the answer you're looking for? Get in touch with our support team.
          </p>
          <button className="innohassle-button-primary px-6 py-3">
            Contact Support
          </button>
        </div>
      </div>

      {/* No Results */}
      {searchTerm && filteredCategories.length === 0 && (
        <div className="innohassle-card p-8 text-center">
          <Search className="mx-auto text-inactive mb-4" size={48} />
          <h3 className="text-xl font-semibold text-contrast mb-2">No results found</h3>
          <p className="text-inactive">
            Try adjusting your search terms or browse through the categories above.
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQPage;