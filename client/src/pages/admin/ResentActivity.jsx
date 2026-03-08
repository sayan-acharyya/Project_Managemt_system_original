import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
} from "../../store/slices/notificationSlice";

import { Bell, Trash2, CheckCheck, Search } from "lucide-react";

const ResentActivity = () => {
    const dispatch = useDispatch();

    const notifications = useSelector((state) => state.notification.list);

    const [search, setSearch] = useState("");
    const [filterPriority, setFilterPriority] = useState("all");

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch]);

    const filteredNotifications = useMemo(() => {
        return (notifications || []).filter((n) => {
            const matchesSearch =
                (n.message || "").toLowerCase().includes(search.toLowerCase());

            const matchesPriority =
                filterPriority === "all" || n.priority === filterPriority;

            return matchesSearch && matchesPriority;
        });
    }, [notifications, search, filterPriority]);

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">

                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-100">
                        <Bell className="w-6 h-6 text-blue-600" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            View All Requests
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            Monitor and manage all system requests, activities, and notifications
                        </p>
                    </div>
                </div>

                 
            </div>

            {/* FILTER BAR */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 md:items-center">

                <div className="relative w-full">
                    <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                    <input
                        type="text"
                        placeholder="Search requests..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    />
                </div>

                <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm
          focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Priority</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                </select>

            </div>

            {/* NOTIFICATION CARDS */}
            <div className="grid gap-4">

                {filteredNotifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-14 text-slate-400 bg-white rounded-xl shadow-sm">
                        <Bell className="w-8 h-8 mb-3 opacity-40" />
                        <p>No notifications found</p>
                    </div>
                )}

                {filteredNotifications.map((n) => (
                    <div
                        key={n._id}
                        className={`bg-white rounded-xl shadow-sm p-5 flex justify-between items-start gap-4
            hover:shadow-md transition
            ${!n.isRead ? "bg-blue-50/40" : ""}`}
                    >

                        {/* LEFT */}
                        <div className="flex gap-3">

                            <div className="mt-1 p-2 rounded-lg bg-slate-100">
                                <Bell className="w-4 h-4 text-slate-500" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-slate-700">
                                    {n.message}
                                </p>

                                {/* TAGS */}
                                <div className="flex gap-2 mt-2 flex-wrap">

                                    <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                                        {n.type}
                                    </span>

                                    <span
                                        className={`text-xs px-2.5 py-1 rounded-full font-medium
                    ${n.priority === "high"
                                                ? "bg-red-100 text-red-600"
                                                : n.priority === "medium"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {n.priority}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-400 mt-1">
                                    {new Date(n.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-3">

                            {!n.isRead && (
                                <button
                                    onClick={() => dispatch(markAsRead(n._id))}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Mark Read
                                </button>
                            )}



                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default ResentActivity;