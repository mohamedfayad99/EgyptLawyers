using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EgyptLawyers.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNationalIdAndIdPhoto : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IdCardImageUrl",
                table: "Lawyers",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NationalIdNumber",
                table: "Lawyers",
                type: "nvarchar(14)",
                maxLength: 14,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdCardImageUrl",
                table: "Lawyers");

            migrationBuilder.DropColumn(
                name: "NationalIdNumber",
                table: "Lawyers");
        }
    }
}
