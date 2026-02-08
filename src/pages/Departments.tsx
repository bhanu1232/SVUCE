
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Building, Zap, Settings, Radio, Code, FlaskConical, ArrowRight, Calendar } from 'lucide-react';

const Departments = () => {
  const departments = [
    {
      id: "civil",
      name: "Civil Engineering",
      icon: <Building className="w-10 h-10" />,
      description: "Pioneering the future of sustainable infrastructure and urban development.",
      established: 1959
    },
    {
      id: "eee",
      name: "Electrical & Electronics",
      icon: <Zap className="w-10 h-10" />,
      description: "Empowering the world with advanced electrical systems and renewable energy.",
      established: 1959
    },
    {
      id: "mechanical",
      name: "Mechanical Engineering",
      icon: <Settings className="w-10 h-10" />,
      description: "Driving innovation in mechanics, robotics, and manufacturing technology.",
      established: 1959
    },
    {
      id: "ece",
      name: "Electronics & Communication",
      icon: <Radio className="w-10 h-10" />,
      description: "Connecting the globe through next-generation communication systems.",
      established: 1970
    },
    {
      id: "cse",
      name: "Computer Science & Engineering",
      icon: <Code className="w-10 h-10" />,
      description: "Shaping the digital era with AI, machine learning, and software innovation.",
      established: 1986
    },
    {
      id: "sciences",
      name: "Humanities & Sciences",
      icon: <FlaskConical className="w-10 h-10" />,
      description: "Building strong foundations in science, mathematics, and humanities.",
      established: 1970
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />

      {/* Info Section */}
      <div className="mt-4 bg-white rounded-xl p-8 md:p-12 border border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Excellence in Engineering Education
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            SVUCE has been at the forefront of engineering education since 1959, nurturing
            thousands of engineers who have made significant contributions to society. Our
            departments are equipped with state-of-the-art facilities and led by experienced faculty.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-iare-blue mb-2">6</div>
              <div className="text-sm text-gray-600">Departments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-iare-blue mb-2">65+</div>
              <div className="text-sm text-gray-600">Years of Legacy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-iare-blue mb-2">100+</div>
              <div className="text-sm text-gray-600">Faculty Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="container mx-auto px-4 py-12 md:py-16 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {departments.map((dept, index) => (
            <Link
              key={dept.id}
              to={`/departments/${dept.id}`}
              className="group"
            >
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-iare-blue transition-all duration-300 h-full flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-iare-blue rounded-lg flex items-center justify-center text-white group-hover:bg-blue-700 transition-colors">
                      {dept.icon}
                    </div>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-iare-blue transition-colors">
                    {dept.name}
                  </h2>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                    {dept.description}
                  </p>

                  <div className="flex items-center text-iare-blue font-semibold group-hover:text-blue-700 transition-colors">
                    <span>Explore Department</span>
                    <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>


      </div>

      <Footer />
    </div>
  );
};

export default Departments;
