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
    
    public partial class Details
    {
        public int Id { get; set; }
        public string StringValue { get; set; }
        public int NumberValue { get; set; }
        public int MetaId { get; set; }
        public Nullable<int> AdvertisementId { get; set; }
    
        public virtual Advertisements Advertisements { get; set; }
        public virtual MetaDetails MetaDetails { get; set; }
    }
}
