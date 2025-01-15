import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, ClipboardList, Coffee, Truck } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeDietCharts: 0,
    mealsToday: 0,
    pendingDeliveries: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('https://hospital-management-ghc3.onrender.com/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await axios.get('https://hospital-management-ghc3.onrender.com/api/dashboard/recent-activities');
      setRecentActivities(response.data);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  const cards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Diet Charts',
      value: stats.activeDietCharts,
      icon: ClipboardList,
      color: 'bg-green-500',
    },
    {
      title: 'Meals Today',
      value: stats.mealsToday,
      icon: Coffee,
      color: 'bg-yellow-500',
    },
    {
      title: 'Pending Deliveries',
      value: stats.pendingDeliveries,
      icon: Truck,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <card.icon
                    className={`h-6 w-6 text-white p-1 rounded ${card.color}`}
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      {card.title}
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Activity
          </h3>
          <div className="mt-6 flow-root">
            <ul className="-mb-8">
              {recentActivities.map((activity, index) => (
                <li key={index}>
                  <div className="relative pb-8">
                    {index !== recentActivities.length - 1 && (
                      <span
                        className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <span
                          className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white"
                        >
                          <svg
                            className="h-5 w-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 001 1h2a1 1 0 100-2h-1V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <a href="#" className="font-medium text-gray-900">
                              {activity.user}
                            </a>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {activity.action}
                          </p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>{activity.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
