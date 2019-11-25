namespace Traffilizer.Service.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class identityChanges : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AspNetUsers", "CreatedOn", c => c.DateTime(nullable: false));
            AddColumn("dbo.AspNetUsers", "Active", c => c.Boolean(nullable: false));
            AddColumn("dbo.AspNetUsers", "Deleted", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AspNetUsers", "Deleted");
            DropColumn("dbo.AspNetUsers", "Active");
            DropColumn("dbo.AspNetUsers", "CreatedOn");
        }
    }
}
