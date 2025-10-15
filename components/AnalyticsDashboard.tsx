import React, { useState, useMemo, useEffect } from 'react';
import { ChatLog } from '../types';
import { fetchChatLogs } from '../services/supabaseService';
import { LineChart } from './charts/LineChart';
import { DonutChart } from './charts/DonutChart';
import { ArrowTrendingUpIcon } from './icons/ArrowTrendingUpIcon';
import { ArrowTrendingDownIcon } from './icons/ArrowTrendingDownIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { ArrowDownTrayIcon } from './icons/ArrowDownTrayIcon';
import { LoadingSpinner } from './LoadingSpinner';


const StatCard: React.FC<{ title: string; value: string; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, change, changeType }) => (
    <div className="glass-effect p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all overflow-hidden">
        <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold gradient-text mt-1 sm:mt-2 truncate">{value}</p>
        {change && (
            <div className={`flex items-center text-[10px] sm:text-xs mt-2 font-medium truncate ${changeType === 'increase' ? 'text-green-600' : 'text-red-500'}`}>
                {changeType === 'increase' ? <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" /> : <ArrowTrendingDownIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />}
                <span className="truncate">{change}</span>
            </div>
        )}
    </div>
);

type TimeRange = '7d' | '30d' | 'mtd' | 'yearly' | 'custom';

export const AnalyticsDashboard: React.FC = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    const [allLogs, setAllLogs] = useState<ChatLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [customStartDate, setCustomStartDate] = useState<string>('');
    const [customEndDate, setCustomEndDate] = useState<string>('');

    useEffect(() => {
        const loadChatLogs = async () => {
            setIsLoading(true);
            try {
                const logs = await fetchChatLogs(365); // Fetch last year of data
                setAllLogs(logs);
            } catch (error) {
                console.error('Error loading chat logs:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadChatLogs();
    }, []);

    const { currentPeriodLogs, previousPeriodLogs } = useMemo(() => {
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date(now);
        let prevStartDate = new Date();
        let prevEndDate = new Date();

        switch (timeRange) {
            case '7d':
                startDate.setDate(now.getDate() - 7);
                prevStartDate.setDate(now.getDate() - 14);
                prevEndDate.setDate(now.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(now.getDate() - 30);
                prevStartDate.setDate(now.getDate() - 60);
                prevEndDate.setDate(now.getDate() - 30);
                break;
            case 'mtd':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                prevEndDate = new Date(now.getFullYear(), now.getMonth(), 1); 
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear(), 0, 1);
                prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
                prevEndDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
                break;
            case 'custom':
                if (!customStartDate || !customEndDate) {
                    return { currentPeriodLogs: [], previousPeriodLogs: [] };
                }
                startDate = new Date(customStartDate);
                endDate = new Date(customEndDate);
                endDate.setHours(23, 59, 59, 999);

                const duration = endDate.getTime() - startDate.getTime();
                prevEndDate = new Date(startDate.getTime());
                prevStartDate = new Date(startDate.getTime() - duration);
                break;
        }

        if (['7d', '30d', 'mtd'].includes(timeRange)) {
            prevEndDate = new Date(startDate.getTime());
        }

        const current = allLogs.filter(log => log.timestamp.getTime() >= startDate.getTime() && log.timestamp.getTime() <= endDate.getTime());
        const previous = allLogs.filter(log => log.timestamp.getTime() >= prevStartDate.getTime() && log.timestamp.getTime() < prevEndDate.getTime());
        
        return { currentPeriodLogs: current, previousPeriodLogs: previous };
    }, [timeRange, allLogs, customStartDate, customEndDate]);


    const calculateChange = (current: number, previous: number): string => {
        if (previous === 0) return current > 0 ? "100.0% Increase" : "0.0%";
        const percentage = ((current - previous) / previous) * 100;
        return `${Math.abs(percentage).toFixed(1)}% ${percentage >= 0 ? 'Increase' : 'Decrease'}`;
    };

    const mainStats = useMemo(() => {
        const totalSessions = currentPeriodLogs.length;
        const prevTotalSessions = previousPeriodLogs.length;

        const uniqueUsers = new Set(currentPeriodLogs.map(l => l.query.length % 100)).size;
        const prevUniqueUsers = new Set(previousPeriodLogs.map(l => l.query.length % 100)).size;

        const unresolvedQueries = currentPeriodLogs.filter(l => !l.wasSuccessful).length;
        const prevUnresolvedQueries = previousPeriodLogs.filter(l => !l.wasSuccessful).length;
        
        const avgResponseTime = totalSessions > 0 ? currentPeriodLogs.reduce((acc, log) => acc + log.responseTime, 0) / totalSessions : 0;
        const prevAvgResponseTime = prevTotalSessions > 0 ? previousPeriodLogs.reduce((acc, log) => acc + log.responseTime, 0) / prevTotalSessions : 0;
        
        return {
            totalSessions,
            uniqueUsers,
            unresolvedQueries,
            avgResponseTime,
            sessionsChange: calculateChange(totalSessions, prevTotalSessions),
            usersChange: calculateChange(uniqueUsers, prevUniqueUsers),
            unresolvedChange: calculateChange(unresolvedQueries, prevUnresolvedQueries),
            responseTimeChange: calculateChange(prevAvgResponseTime, avgResponseTime)
        };
    }, [currentPeriodLogs, previousPeriodLogs]);
    
    const lineChartData = useMemo(() => {
        if (currentPeriodLogs.length === 0) return [];
        const now = new Date();

        if (timeRange === 'yearly') {
            const monthMap: { [key: string]: { value: number; date: string } } = {};
            const year = now.getFullYear();
            for (let i = 0; i < 12; i++) {
                const date = new Date(year, i, 1);
                const key = date.toLocaleDateString('id-ID', { month: 'short' });
                monthMap[key] = { value: 0, date: date.toISOString().split('T')[0] };
            }
            currentPeriodLogs.forEach(log => {
                if (log.timestamp.getFullYear() === year) {
                    const key = log.timestamp.toLocaleDateString('id-ID', { month: 'short' });
                    if (monthMap[key]) {
                        monthMap[key].value++;
                    }
                }
            });
            return Object.values(monthMap);
        }
        
        const logsByDate: { [key: string]: number } = {};
        currentPeriodLogs.forEach(log => {
            const key = log.timestamp.toLocaleDateString('en-CA');
            logsByDate[key] = (logsByDate[key] || 0) + 1;
        });

        let chartStartDate: Date;
        let chartEndDate: Date;

        switch (timeRange) {
            case '7d':
                chartEndDate = now;
                chartStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
                break;
            case '30d':
                chartEndDate = now;
                chartStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
                break;
            case 'mtd':
                chartEndDate = now;
                chartStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'custom':
                if (!customStartDate || !customEndDate) return [];
                chartStartDate = new Date(customStartDate);
                chartEndDate = new Date(customEndDate);
                break;
            default:
                return [];
        }

        const dateMap: { [key: string]: number } = {};
        const iterDate = new Date(chartStartDate);
        const safeEndDate = new Date(chartEndDate);

        if (iterDate > safeEndDate) return [];

        while (iterDate <= safeEndDate) {
            const key = iterDate.toLocaleDateString('en-CA');
            dateMap[key] = logsByDate[key] || 0;
            iterDate.setDate(iterDate.getDate() + 1);
        }
        
        return Object.entries(dateMap)
            .map(([date, value]) => ({ date, value }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    }, [currentPeriodLogs, timeRange, customStartDate, customEndDate]);

    const donutChartData = useMemo(() => {
        const serviceCounts = currentPeriodLogs.reduce((acc: Record<string, number>, log) => {
            acc[log.serviceInquired] = (acc[log.serviceInquired] || 0) + 1;
            return acc;
        // FIX: Cast the initial value of reduce to ensure TypeScript infers the correct return type.
        // This prevents a type error on line 200 where `b.value - a.value` would fail if `value` was not a `number`.
        }, {} as Record<string, number>);

        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'];
        return Object.entries(serviceCounts)
            .map(([name, value], index) => ({ name, value: Number(value), color: colors[index % colors.length] }))
            .sort((a, b) => b.value - a.value);
    }, [currentPeriodLogs]);

    const topKeywords = useMemo(() => {
        const keywordCounts: Record<string, { count: number, prevCount: number }> = {};
        
        const processLogs = (logs: ChatLog[], period: 'current' | 'previous') => {
            logs.forEach(log => {
                const words = log.query.toLowerCase().match(/\b(ktp|sim|skck|bpjs|paspor|pajak|usaha|nikah)\b/g);
                if(words){
                    words.forEach(word => {
                        if (!keywordCounts[word]) keywordCounts[word] = { count: 0, prevCount: 0 };
                        if (period === 'current') keywordCounts[word].count++;
                        else keywordCounts[word].prevCount++;
                    })
                }
            });
        };
        
        processLogs(currentPeriodLogs, 'current');
        processLogs(previousPeriodLogs, 'previous');

        return Object.entries(keywordCounts)
            .map(([keyword, counts]) => ({ keyword, ...counts }))
            .sort((a,b) => b.count - a.count)
            .slice(0, 7);

    }, [currentPeriodLogs, previousPeriodLogs]);
    
    const failedQueries = useMemo(() => {
        return currentPeriodLogs
            .filter(log => !log.wasSuccessful)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 7);
    }, [currentPeriodLogs]);

    const downloadCSV = (type: 'all' | 'summary' | 'failed' = 'all') => {
        let csvContent = '';
        let filename = '';
        
        const dateRange = timeRange === 'custom' && customStartDate && customEndDate
            ? `${customStartDate}_${customEndDate}`
            : timeRange;
        const dateStr = new Date().toISOString().split('T')[0];

        if (type === 'all') {
            // All chat logs
            const headers = ['Tanggal & Waktu', 'Pertanyaan', 'Layanan Dicari', 'Waktu Respons (ms)', 'Status'];
            const rows = currentPeriodLogs.map(log => [
                log.timestamp.toLocaleString('id-ID'),
                `"${log.query.replace(/"/g, '""')}"`,
                log.serviceInquired,
                log.responseTime.toString(),
                log.wasSuccessful ? 'Berhasil' : 'Gagal'
            ]);
            csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
            filename = `analytics_all_${dateRange}_${dateStr}.csv`;
        } else if (type === 'summary') {
            // Summary statistics
            const headers = ['Metrik', 'Nilai', 'Perubahan'];
            const rows = [
                ['Total Sesi Chat', mainStats.totalSessions.toString(), mainStats.sessionsChange],
                ['Pengguna Unik (Estimasi)', mainStats.uniqueUsers.toString(), mainStats.usersChange],
                ['Pertanyaan Tidak Terjawab', mainStats.unresolvedQueries.toString(), mainStats.unresolvedChange],
                ['Waktu Respons Rata-rata (ms)', mainStats.avgResponseTime.toFixed(2), mainStats.responseTimeChange],
                ['', '', ''],
                ['Top Layanan Dicari', '', ''],
                ...donutChartData.map(item => [item.name, item.value.toString(), `${((item.value / mainStats.totalSessions) * 100).toFixed(1)}%`]),
                ['', '', ''],
                ['Top Kata Kunci', 'Jumlah', 'Perubahan'],
                ...topKeywords.map(item => [
                    item.keyword,
                    item.count.toString(),
                    item.count > item.prevCount ? `+${item.count - item.prevCount}` : `${item.count - item.prevCount}`
                ])
            ];
            csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
            filename = `analytics_summary_${dateRange}_${dateStr}.csv`;
        } else if (type === 'failed') {
            // Failed queries only
            const headers = ['Tanggal & Waktu', 'Pertanyaan', 'Layanan Dicari', 'Waktu Respons (ms)'];
            const rows = currentPeriodLogs
                .filter(log => !log.wasSuccessful)
                .map(log => [
                    log.timestamp.toLocaleString('id-ID'),
                    `"${log.query.replace(/"/g, '""')}"`,
                    log.serviceInquired,
                    log.responseTime.toString()
                ]);
            csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
            filename = `analytics_failed_${dateRange}_${dateStr}.csv`;
        }

        // Add BOM for Excel UTF-8 support
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        
        // Create download link
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

  if (isLoading) {
    return <LoadingSpinner message="Memuat data analitik..." submessage="Menganalisis data pengguna" size="lg" />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold gradient-text">Analitik Pengguna</h2>
                <div className="relative group">
                    <button
                        disabled={currentPeriodLogs.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download data sebagai CSV"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Download CSV</span>
                        <span className="sm:hidden">CSV</span>
                    </button>
                    {currentPeriodLogs.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <button
                                onClick={() => downloadCSV('all')}
                                className="w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-blue-50 rounded-t-lg transition-colors"
                            >
                                📊 Semua Data
                            </button>
                            <button
                                onClick={() => downloadCSV('summary')}
                                className="w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                            >
                                📈 Ringkasan Statistik
                            </button>
                            <button
                                onClick={() => downloadCSV('failed')}
                                className="w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-blue-50 rounded-b-lg transition-colors"
                            >
                                ⚠️ Pertanyaan Gagal
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center glass-effect p-1 rounded-lg sm:rounded-xl shadow-md border border-blue-100 flex-wrap gap-1">
                    {(['7d', '30d', 'mtd', 'yearly', 'custom'] as TimeRange[]).map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs md:text-sm font-semibold rounded-md transition-all ${timeRange === range ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50'}`}
                        >
                            {range === '7d' ? '7 Hari' : range === '30d' ? '30 Hari' : range === 'mtd' ? 'Bulan Ini' : range === 'yearly' ? 'Tahunan' : 'Kustom'}
                        </button>
                    ))}
                </div>
                {timeRange === 'custom' && (
                    <div className="flex items-center gap-1 sm:gap-2 p-1 glass-effect rounded-lg sm:rounded-xl shadow-md border border-blue-100">
                        <input 
                            type="date"
                            value={customStartDate}
                            onChange={e => setCustomStartDate(e.target.value)}
                            className="text-[10px] sm:text-xs p-1 border-2 border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                         <span className="text-gray-500 text-xs">-</span>
                        <input 
                            type="date"
                            value={customEndDate}
                            onChange={e => setCustomEndDate(e.target.value)}
                            className="text-[10px] sm:text-xs p-1 border-2 border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                )}
            </div>
        </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <StatCard 
                title="Total Sesi Chat" 
                value={mainStats.totalSessions.toLocaleString('id-ID')} 
                change={mainStats.sessionsChange.split(' ')[0]}
                changeType={mainStats.sessionsChange.includes('Increase') ? 'increase' : 'decrease'}
            />
             <StatCard 
                title="Pengguna Unik (Estimasi)" 
                value={mainStats.uniqueUsers.toLocaleString('id-ID')} 
                change={mainStats.usersChange.split(' ')[0]}
                changeType={mainStats.usersChange.includes('Increase') ? 'increase' : 'decrease'}
            />
            <StatCard 
                title="Pertanyaan Tidak Terjawab" 
                value={mainStats.unresolvedQueries.toLocaleString('id-ID')} 
                change={mainStats.unresolvedChange.split(' ')[0]}
                changeType={mainStats.unresolvedChange.includes('Increase') ? 'increase' : 'decrease'}
            />
            <StatCard 
                title="Waktu Respons Rata-rata" 
                value={`${(mainStats.avgResponseTime / 1000).toFixed(2)}s`} 
                change={mainStats.responseTimeChange.split(' ')[0]}
                changeType={mainStats.responseTimeChange.includes('Increase') ? 'increase' : 'decrease'}
            />
      </div>

      {/* Daily Activity Chart - Full Width */}
      <div className="glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-3 sm:mb-4 truncate">Aktivitas Sesi {timeRange === 'yearly' ? 'Bulanan' : 'Harian'}</h3>
          <div className="h-64 sm:h-72 overflow-hidden">
               <LineChart data={lineChartData} />
          </div>
      </div>
      
      {/* Service Breakdown Chart - Full Width */}
      <div className="glass-effect p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-4 sm:mb-6 truncate">📊 Rincian Layanan Dicari</h3>
          <div className="h-80 sm:h-96 overflow-hidden">
              <DonutChart data={donutChartData} />
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Keywords */}
        <div className="glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-3 sm:mb-4 truncate">🔑 Top Kata Kunci</h3>
          <div className="overflow-y-auto max-h-96">
            <ul className="space-y-2 sm:space-y-3">
              {topKeywords.map((item) => (
                <li key={item.keyword} className="flex justify-between items-center text-xs sm:text-sm bg-white/50 p-2 sm:p-3 rounded-lg border border-blue-50">
                  <span className="text-gray-700 font-semibold capitalize truncate flex-1 mr-2">{item.keyword}</span>
                  <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                    <span className={`text-xs flex items-center ${item.count > item.prevCount ? 'text-green-600' : 'text-red-500'}`}>
                      {item.count > item.prevCount ? <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4"/> : <ArrowTrendingDownIcon className="w-3 h-3 sm:w-4 sm:h-4"/>}
                    </span>
                    <span className="font-bold text-gray-800 w-10 sm:w-12 text-right">{item.count.toLocaleString('id-ID')}</span>
                  </div>
                </li>
              ))}
              {topKeywords.length === 0 && (
                  <p className="text-xs sm:text-sm text-center text-gray-500 py-6 sm:py-8">Tidak ada kata kunci yang ditemukan pada periode ini.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Failed Queries */}
         <div className="glass-effect p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center truncate">
            <QuestionMarkCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 sm:mr-2 text-amber-500 flex-shrink-0" />
            <span className="truncate">Pertanyaan Perlu Tinjauan</span>
          </h3>
          <div className="overflow-y-auto max-h-96">
            <ul className="space-y-2 sm:space-y-3">
              {failedQueries.map((log) => (
                <li key={log.id} className="text-xs sm:text-sm bg-white/50 p-2 sm:p-3 rounded-lg border border-blue-50">
                  <p className="text-gray-700 font-medium line-clamp-2 leading-snug break-words">"{log.query}"</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">{log.timestamp.toLocaleString('id-ID')}</p>
                </li>
              ))}
              {failedQueries.length === 0 && (
                  <p className="text-xs sm:text-sm text-center text-gray-500 py-6 sm:py-8">Tidak ada pertanyaan yang perlu ditinjau pada periode ini. Kerja bagus!</p>
              )}
            </ul>
          </div>
        </div>
       </div>

    </div>
  );
};