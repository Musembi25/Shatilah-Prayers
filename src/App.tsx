import React, { useState, useEffect } from 'react';
import { Heart, Cross, Sun, Moon, Calendar, BookOpen, Users, Shield, Star, Church, Coffee, Sunrise } from 'lucide-react';

interface PrayerDay {
  day: string;
  theme: string;
  icon: React.ReactNode;
  prayers: string[];
  specialNote?: string;
  color: string;
}

interface PrayerProgress {
  [key: string]: boolean;
}

interface SharedRequest {
  id: string;
  text: string;
  date: string;
  completed: boolean;
}

const PRAYER_SCHEDULE: PrayerDay[] = [
  {
    day: 'Sunday',
    theme: 'Church & Worship',
    icon: <Church className="w-6 h-6" />,
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    prayers: [
      'Morning praise and worship together',
      'Prayer for our church community and pastors',
      'Thanksgiving for God\'s faithfulness in our relationship',
      'Intercession for church growth and unity',
      'Prayer for wisdom in serving together',
      'Evening reflection on God\'s Word'
    ]
  },
  {
    day: 'Monday',
    theme: 'New Beginnings & Unity',
    icon: <Sunrise className="w-6 h-6" />,
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    prayers: [
      'Morning prayer for unity in our relationship',
      'Seeking God\'s guidance for the week ahead',
      'Prayer for trust and communication',
      'Intercession for our future marriage plans',
      'Prayer for strength to love sacrificially',
      'Evening gratitude for each other'
    ]
  },
  {
    day: 'Tuesday',
    theme: 'Trust & Communication',
    icon: <Heart className="w-6 h-6" />,
    color: 'bg-gradient-to-br from-pink-500 to-rose-500',
    prayers: [
      'Prayer for deeper trust between us',
      'Seeking wisdom in our conversations',
      'Prayer for patience and understanding',
      'Intercession for emotional healing',
      'Prayer for authentic vulnerability',
      'Evening prayer for peaceful rest'
    ]
  },
  {
    day: 'Wednesday',
    theme: 'Future & Family',
    icon: <Users className="w-6 h-6" />,
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    prayers: [
      'Prayer for our future family and children',
      'Seeking God\'s will for our career paths',
      'Prayer for financial wisdom and provision',
      'Intercession for our parents and families',
      'Prayer for preparing our hearts for marriage',
      'Evening prayer for shared dreams and visions'
    ]
  },
  {
    day: 'Thursday',
    theme: 'Fasting & Spiritual Warfare',
    icon: <Shield className="w-6 h-6" />,
    color: 'bg-gradient-to-br from-red-500 to-red-600',
    specialNote: 'Fasting Day (Lunch Only)',
    prayers: [
      'Morning fast and prayer for spiritual breakthrough',
      'Warfare prayer against relationship attacks',
      'Binding strongholds over our families',
      'Prayer for protection from temptation',
      'Intercession for spiritual growth and maturity',
      'Evening breaking of fast with thanksgiving'
    ]
  },
  {
    day: 'Friday',
    theme: 'Purpose & Ministry',
    icon: <Star className="w-6 h-6" />,
    color: 'bg-gradient-to-br from-yellow-500 to-orange-500',
    prayers: [
      'Prayer for discovering our joint ministry calling',
      'Seeking God\'s purpose for our relationship',
      'Prayer for opportunities to serve together',
      'Intercession for the lost and broken',
      'Prayer for boldness in sharing our faith',
      'Evening prayer for fruitfulness in God\'s kingdom'
    ]
  },
  {
    day: 'Saturday',
    theme: 'Rest & Reflection',
    icon: <Moon className="w-6 h-6" />,
    color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    prayers: [
      'Morning quiet time and meditation',
      'Reflection on the week\'s spiritual growth',
      'Thanksgiving for answered prayers',
      'Prayer for rest and sabbath peace',
      'Intercession for personal character development',
      'Evening prayer of gratitude and contentment'
    ]
  }
];

const SPIRITUAL_QUOTES = [
  "Two are better than one, because they have a good return for their labor. - Ecclesiastes 4:9",
  "Above all else, guard your heart, for everything you do flows from it. - Proverbs 4:23",
  "Love is patient, love is kind... - 1 Corinthians 13:4",
  "Commit to the Lord whatever you do, and he will establish your plans. - Proverbs 16:3",
  "Be completely humble and gentle; be patient, bearing with one another in love. - Ephesians 4:2"
];

function App() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [prayerProgress, setPrayerProgress] = useState<PrayerProgress>({});
  const [sharedRequests, setSharedRequests] = useState<SharedRequest[]>([]);
  const [newRequest, setNewRequest] = useState('');
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');

  // Convert Sunday = 0 to Sunday = 6 for our array indexing
  const dayIndex = selectedDay === 0 ? 6 : selectedDay - 1;
  const currentDaySchedule = PRAYER_SCHEDULE[dayIndex];

  useEffect(() => {
    // Load saved data from localStorage
    const savedProgress = localStorage.getItem('shatilah-progress');
    const savedRequests = localStorage.getItem('shatilah-requests');
    
    if (savedProgress) {
      setPrayerProgress(JSON.parse(savedProgress));
    }
    
    if (savedRequests) {
      setSharedRequests(JSON.parse(savedRequests));
    }

    // Show random quote on load
    const randomQuote = SPIRITUAL_QUOTES[Math.floor(Math.random() * SPIRITUAL_QUOTES.length)];
    setCurrentQuote(randomQuote);
    setShowQuote(true);
  }, []);

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem('shatilah-progress', JSON.stringify(prayerProgress));
  }, [prayerProgress]);

  useEffect(() => {
    // Save requests to localStorage
    localStorage.setItem('shatilah-requests', JSON.stringify(sharedRequests));
  }, [sharedRequests]);

  const togglePrayerComplete = (dayKey: string, prayerIndex: number) => {
    const key = `${dayKey}-${prayerIndex}`;
    setPrayerProgress(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const addSharedRequest = () => {
    if (newRequest.trim()) {
      const request: SharedRequest = {
        id: Date.now().toString(),
        text: newRequest.trim(),
        date: new Date().toLocaleDateString(),
        completed: false
      };
      setSharedRequests(prev => [request, ...prev]);
      setNewRequest('');
    }
  };

  const toggleRequestComplete = (id: string) => {
    setSharedRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, completed: !req.completed } : req
      )
    );
  };

  const deleteRequest = (id: string) => {
    setSharedRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Spiritual Quote Modal */}
      {showQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-2xl transform animate-fade-in">
            <div className="text-center">
              <Cross className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-700 italic mb-6 leading-relaxed">{currentQuote}</p>
              <button
                onClick={() => setShowQuote(false)}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-300"
              >
                Begin Prayer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Cross className="w-10 h-10 text-blue-600 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              SHATILAH
            </h1>
            <Heart className="w-10 h-10 text-pink-500 ml-3" />
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A sacred space for our spiritual journey together. Growing in prayer, unity, and divine purpose.
          </p>
        </div>

        {/* Day Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {PRAYER_SCHEDULE.map((day, index) => {
            const dayNumber = index === 6 ? 0 : index + 1; // Convert back to JS day numbering
            const isSelected = selectedDay === dayNumber;
            return (
              <button
                key={day.day}
                onClick={() => setSelectedDay(dayNumber)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  isSelected
                    ? `${day.color} text-white border-transparent shadow-lg`
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col items-center">
                  {day.icon}
                  <span className="text-sm font-semibold mt-2">{day.day}</span>
                  <span className="text-xs opacity-80 mt-1 text-center">{day.theme}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Daily Prayer Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className={`p-3 rounded-xl ${currentDaySchedule.color} text-white mr-4`}>
                  {currentDaySchedule.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{currentDaySchedule.day}</h2>
                  <p className="text-gray-600">{currentDaySchedule.theme}</p>
                  {currentDaySchedule.specialNote && (
                    <p className="text-red-600 text-sm font-semibold mt-1">
                      ⚡ {currentDaySchedule.specialNote}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {currentDaySchedule.prayers.map((prayer, index) => {
                  const key = `${currentDaySchedule.day}-${index}`;
                  const isCompleted = prayerProgress[key] || false;
                  
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start">
                        <button
                          onClick={() => togglePrayerComplete(currentDaySchedule.day, index)}
                          className={`w-6 h-6 rounded-full border-2 mr-4 mt-0.5 flex items-center justify-center transition-all duration-300 ${
                            isCompleted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-400'
                          }`}
                        >
                          {isCompleted && <span className="text-xs">✓</span>}
                        </button>
                        <div className="flex-1">
                          <p className={`text-gray-700 ${isCompleted ? 'line-through opacity-60' : ''}`}>
                            {prayer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
                <div className="flex items-center text-blue-700">
                  <BookOpen className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Prayer Tip:</span>
                </div>
                <p className="text-blue-600 text-sm mt-2">
                  Pray together, holding hands when possible. Let each prayer be a conversation with God about your relationship and His plans for you both.
                </p>
              </div>
            </div>
          </div>

          {/* Shared Prayer Requests */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center mb-6">
                <Heart className="w-6 h-6 text-pink-500 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">Our Prayer Requests</h3>
              </div>

              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={newRequest}
                  onChange={(e) => setNewRequest(e.target.value)}
                  placeholder="Share a prayer request..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && addSharedRequest()}
                />
                <button
                  onClick={addSharedRequest}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 font-semibold"
                >
                  Add Request
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sharedRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      request.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className={`text-sm flex-1 ${request.completed ? 'line-through opacity-60' : ''}`}>
                        {request.text}
                      </p>
                      <div className="flex space-x-2 ml-2">
                        <button
                          onClick={() => toggleRequestComplete(request.id)}
                          className={`w-6 h-6 rounded-full text-xs ${
                            request.completed
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 hover:bg-green-400 text-gray-600'
                          }`}
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => deleteRequest(request.id)}
                          className="w-6 h-6 rounded-full bg-red-300 hover:bg-red-400 text-red-600 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{request.date}</p>
                  </div>
                ))}
                {sharedRequests.length === 0 && (
                  <p className="text-gray-500 text-center py-8 italic">
                    No prayer requests yet. Add one above to get started.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const randomQuote = SPIRITUAL_QUOTES[Math.floor(Math.random() * SPIRITUAL_QUOTES.length)];
                    setCurrentQuote(randomQuote);
                    setShowQuote(true);
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold"
                >
                  Daily Scripture
                </button>
                <button
                  onClick={() => {
                    const progress = Object.keys(prayerProgress).filter(key => 
                      key.startsWith(currentDaySchedule.day) && prayerProgress[key]
                    ).length;
                    const total = currentDaySchedule.prayers.length;
                    alert(`Today's Progress: ${progress}/${total} prayers completed`);
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 font-semibold"
                >
                  Check Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-16 py-8 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Cross className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                SHATILAH
              </h3>
              <Heart className="w-6 h-6 text-pink-500 ml-2" />
            </div>
            <p className="text-gray-600 mb-4">
              Growing together in prayer, unity, and divine purpose
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>© 2025 SHATILAH</span>
              <span>•</span>
              <span>Built with love and faith</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;