using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EgyptLawyers.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRatingToReply : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "HelpPostReplies",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "HelpPostReplies");
        }
    }
}
