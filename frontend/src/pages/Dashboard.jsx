import { useState, useEffect } from 'react';
import { Users, ClipboardList, Coffee, Truck } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeDietCharts: 0,
    mealsToday: 0,
    pendingDeliveries: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dashboard/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

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
              {/* Add your activity items here */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

