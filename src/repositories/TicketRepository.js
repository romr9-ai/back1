const Ticket = require('../models/Ticket');

class TicketRepository {
  async createTicket(ticketData) {
    return await Ticket.create(ticketData);
  }

  async getTicketById(ticketId) {
    return await Ticket.findById(ticketId);
  }

  async getAllTickets() {
    return await Ticket.find().lean();
  }
}

module.exports = new TicketRepository();
