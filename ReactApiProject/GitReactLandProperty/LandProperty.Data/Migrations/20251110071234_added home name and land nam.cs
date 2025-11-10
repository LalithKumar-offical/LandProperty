using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LandProperty.Data.Migrations
{
    /// <inheritdoc />
    public partial class addedhomenameandlandnam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LandName",
                table: "OwnerLandDetails",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HomeName",
                table: "OwnerHomeDetails",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DocumentPath",
                table: "LandDocuments",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LandName",
                table: "OwnerLandDetails");

            migrationBuilder.DropColumn(
                name: "HomeName",
                table: "OwnerHomeDetails");

            migrationBuilder.AlterColumn<string>(
                name: "DocumentPath",
                table: "LandDocuments",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }
    }
}
