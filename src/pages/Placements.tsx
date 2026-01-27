import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { TrendingUp, Building2, Users, Award, Quote, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PlacementStats {
  id: string;
  year: string;
  placementRate: number;
  highestPackage: string;
  averagePackage: string;
  companiesVisited: number;
}

interface Recruiter {
  id: string;
  companyName: string;
  logoUrl: string;
  order: number;
}

interface Placement {
  id: string;
  studentName: string;
  company: string;
  package: string;
  department: string;
  year: string;
  imageUrl?: string;
}

interface Testimonial {
  id: string;
  studentName: string;
  company: string;
  quote: string;
  imageUrl?: string;
  year: string;
}

const Placements = () => {
  const [stats, setStats] = useState<PlacementStats | null>(null);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch latest stats
      const statsSnapshot = await getDocs(
        query(collection(db, 'placementStats'), orderBy('year', 'desc'), limit(1))
      );
      if (!statsSnapshot.empty) {
        const doc = statsSnapshot.docs[0];
        setStats({ id: doc.id, ...doc.data() } as PlacementStats);
      }

      // Fetch recruiters
      const recruitersSnapshot = await getDocs(
        query(collection(db, 'recruiters'), orderBy('order', 'asc'))
      );
      const recruitersData: Recruiter[] = [];
      recruitersSnapshot.forEach((doc) => {
        recruitersData.push({ id: doc.id, ...doc.data() } as Recruiter);
      });
      setRecruiters(recruitersData);

      // Fetch recent placements
      const placementsSnapshot = await getDocs(
        query(collection(db, 'placements'), orderBy('year', 'desc'), limit(8))
      );
      const placementsData: Placement[] = [];
      placementsSnapshot.forEach((doc) => {
        placementsData.push({ id: doc.id, ...doc.data() } as Placement);
      });
      setPlacements(placementsData);

      // Fetch testimonials
      const testimonialsSnapshot = await getDocs(
        query(collection(db, 'testimonials'), orderBy('year', 'desc'), limit(4))
      );
      const testimonialsData: Testimonial[] = [];
      testimonialsSnapshot.forEach((doc) => {
        testimonialsData.push({ id: doc.id, ...doc.data() } as Testimonial);
      });
      setTestimonials(testimonialsData);

      console.log('Fetched placement data:', {
        stats: !!stats,
        recruiters: recruitersData.length,
        placements: placementsData.length,
        testimonials: testimonialsData.length
      });
    } catch (error) {
      console.error('Error fetching placement data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iare-blue"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto my-8 sm:my-10 md:my-12 px-4 flex-grow">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-iare-blue mb-3 sm:mb-4">
            Placements & Career Opportunities
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Empowering students with world-class career opportunities at leading organizations
          </p>
        </div>

        {/* Statistics Section */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
            <Card className="bg-white border-l-4 border-blue-600 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Placement Rate</p>
                    <p className="text-4xl font-bold text-blue-600">{stats.placementRate}%</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-green-600 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Highest Package</p>
                    <p className="text-4xl font-bold text-green-600">{stats.highestPackage}</p>
                  </div>
                  <Award className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-purple-600 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Average Package</p>
                    <p className="text-4xl font-bold text-purple-600">{stats.averagePackage}</p>
                  </div>
                  <Briefcase className="w-12 h-12 text-purple-600 opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-orange-600 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Companies Visited</p>
                    <p className="text-4xl font-bold text-orange-600">{stats.companiesVisited}+</p>
                  </div>
                  <Building2 className="w-12 h-12 text-orange-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Recruiters */}
        {recruiters.length > 0 && (
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 text-center">Our Top Recruiters</h2>
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
                {recruiters.map((recruiter) => (
                  <div
                    key={recruiter.id}
                    className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gray-50"
                  >
                    {recruiter.logoUrl && recruiter.logoUrl !== '#' ? (
                      <img
                        src={recruiter.logoUrl}
                        alt={recruiter.companyName}
                        className="max-h-12 max-w-full object-contain"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-700 text-center">
                        {recruiter.companyName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Placements */}
        {placements.length > 0 && (
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 text-center">Recent Placements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {placements.map((placement) => (
                <Card key={placement.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-iare-blue flex items-center justify-center mb-4">
                        {placement.imageUrl && placement.imageUrl !== '#' ? (
                          <img
                            src={placement.imageUrl}
                            alt={placement.studentName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-10 h-10 text-white" />
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{placement.studentName}</h3>
                      <p className="text-iare-blue font-semibold mb-1">{placement.company}</p>
                      <p className="text-green-600 font-bold text-xl mb-2">{placement.package}</p>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {placement.department}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                          {placement.year}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Student Testimonials */}
        {testimonials.length > 0 && (
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 text-center">Student Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="bg-white border-l-4 border-iare-blue hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <Quote className="w-8 h-8 text-iare-blue mb-4" />
                    <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-iare-blue flex items-center justify-center">
                        {testimonial.imageUrl && testimonial.imageUrl !== '#' ? (
                          <img
                            src={testimonial.imageUrl}
                            alt={testimonial.studentName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{testimonial.studentName}</p>
                        <p className="text-sm text-iare-blue">{testimonial.company} • {testimonial.year}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!stats && recruiters.length === 0 && placements.length === 0 && testimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No placement data available. Please add data from the Admin CRM.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Placements;
