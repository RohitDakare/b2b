import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));

    fetch('http://localhost:5000/api/tickets')
      .then(res => res.json())
      .then(data => setTickets(data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Users</h2>
      <table className="w-full my-4 border">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}><td>{user._id}</td><td>{user.name}</td><td>{user.email}</td></tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold">Tickets</h2>
      <table className="w-full my-4 border">
        <thead>
          <tr><th>ID</th><th>From</th><th>To</th><th>Date</th></tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket._id}><td>{ticket._id}</td><td>{ticket.from}</td><td>{ticket.to}</td><td>{ticket.date}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
