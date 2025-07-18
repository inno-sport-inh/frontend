import React from 'react';
import { Dumbbell, Target, Timer, TrendingUp, Award } from 'lucide-react';

const AdminPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 mobile-content-bottom-padding">
            {/* Header */}
            <div className="text-center px-4">
                <div className="flex items-center justify-center space-x-3 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <Dumbbell size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-contrast">Fitness Test</h1>
                        <p className="text-inactive">Track your physical performance</p>
                    </div>
                </div>
            </div>

            {/* Coming Soon Card */}
            <div className="innohassle-card p-8 text-center mx-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Dumbbell size={48} className="text-blue-500" />
                </div>

                <h2 className="text-2xl font-bold text-contrast mb-4">Fitness Test Coming Soon</h2>
                <p className="text-inactive text-lg mb-8 max-w-2xl mx-auto">
                    We're developing a comprehensive fitness testing system to help you track your physical progress.
                    Stay tuned for updates!
                </p>

                {/* Feature Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-xl border border-secondary/50">
                        <Target size={32} className="text-blue-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-contrast mb-2">Performance Tracking</h3>
                        <p className="text-sm text-inactive">Monitor your progress across different exercises</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-xl border border-secondary/50">
                        <Timer size={32} className="text-green-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-contrast mb-2">Timed Tests</h3>
                        <p className="text-sm text-inactive">Complete standardized fitness assessments</p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-xl border border-secondary/50">
                        <Award size={32} className="text-yellow-500 mx-auto mb-4" />
                        <h3 className="font-semibold text-contrast mb-2">Achievement System</h3>
                        <p className="text-sm text-inactive">Earn badges and track improvements</p>
                    </div>
                </div>

                <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-blue-500/10 rounded-xl border border-blue-500/30">
                    <TrendingUp size={20} className="text-blue-500" />
                    <span className="text-blue-500 font-medium">Development in Progress</span>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;