//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DatabaseDiagram
{
    using System;
    using System.Collections.Generic;
    
    public partial class Subscriptions
    {
        public int Id { get; set; }
        public System.DateTime ExpiryDate { get; set; }
        public bool IsAutoRenewed { get; set; }
        public int ModelId { get; set; }
        public string UserId { get; set; }
    
        public virtual SubscriptionModels SubscriptionModels { get; set; }
        public virtual Users Users { get; set; }
    }
}
