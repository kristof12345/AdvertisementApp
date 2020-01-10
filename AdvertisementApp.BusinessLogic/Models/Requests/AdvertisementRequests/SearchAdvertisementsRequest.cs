using AdvertisementApp.BusinessLogic.Models.Advertisements;
using System;
using System.Collections.Generic;

namespace AdvertisementApp.BusinessLogic.Models.AdvertisementRequests
{
    public enum OrderBy
    {
        Title,
        Price,
        Date
    }

    public enum Order
    {
        Ascending,
        Descending
    }

    public class SearchAdvertisementsRequest
    {
        public string Title { get; set; } = "";

        public int? MinPrice { get; set; } = 0;

        public int MaxPrice { get; set; } = int.MaxValue;

        public DateTime MinDate { get; set; } = DateTime.MinValue;

        public DateTime MaxDate { get; set; } = DateTime.Now;

        public int CategoryId { get; set; } = 0;

        public ICollection<Detail> Details { get; set; } = new List<Detail>();

        public OrderBy OrderBy { get; set; } = OrderBy.Title;

        public Order Order { get; set; } = Order.Ascending;
    }
}
