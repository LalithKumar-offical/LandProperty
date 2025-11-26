using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LandProperty.Data.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleTypeNo = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    UserEmail = table.Column<string>(type: "nvarchar(25)", maxLength: 25, nullable: false),
                    UserPhoneNo = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    UserPassword = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserBalance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Loggers",
                columns: table => new
                {
                    LogId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    EntityType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    EntityId = table.Column<int>(type: "int", nullable: true),
                    ActionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Loggers", x => x.LogId);
                    table.ForeignKey(
                        name: "FK_Loggers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OwnerHomeDetails",
                columns: table => new
                {
                    HomeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HomeDiscription = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    HomeAddress = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    HomeCity = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    HomeState = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    HomePincode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AreaInSqFt = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    HomePhoneno = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    HomePriceInital = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    HomeSellDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    HomeStatusApproved = table.Column<bool>(type: "bit", nullable: false),
                    RejectedReason = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OwnerHomeDetails", x => x.HomeId);
                    table.ForeignKey(
                        name: "FK_OwnerHomeDetails_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OwnerLandDetails",
                columns: table => new
                {
                    LandId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LandDescription = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LandAddress = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    LandCity = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    LandState = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    LandStatusApproved = table.Column<bool>(type: "bit", nullable: false),
                    RejectedReason = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    LandPincode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LandAreaInSqFt = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    LandPhoneno = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    LandPriceInitial = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    LandSellDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OwnerLandDetails", x => x.LandId);
                    table.ForeignKey(
                        name: "FK_OwnerLandDetails_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HomeDocuments",
                columns: table => new
                {
                    HomeDocumnetsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DocumentType = table.Column<int>(type: "int", nullable: true),
                    DocumentDetailsExtracted = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DocumentPath = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    HomeId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeDocuments", x => x.HomeDocumnetsId);
                    table.ForeignKey(
                        name: "FK_HomeDocuments_OwnerHomeDetails_HomeId",
                        column: x => x.HomeId,
                        principalTable: "OwnerHomeDetails",
                        principalColumn: "HomeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserHomeApplications",
                columns: table => new
                {
                    ApplicationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HomeId = table.Column<int>(type: "int", nullable: false),
                    OfferedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: true),
                    PurchasedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserHomeApplications", x => x.ApplicationId);
                    table.ForeignKey(
                        name: "FK_UserHomeApplications_OwnerHomeDetails_HomeId",
                        column: x => x.HomeId,
                        principalTable: "OwnerHomeDetails",
                        principalColumn: "HomeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserHomeApplications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Bids",
                columns: table => new
                {
                    BidId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BidAmountByUser = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BidAmountByOwner = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PropertyType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PurchaseRequest = table.Column<bool>(type: "bit", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HomeId = table.Column<int>(type: "int", nullable: true),
                    LandId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bids", x => x.BidId);
                    table.ForeignKey(
                        name: "FK_Bids_OwnerHomeDetails_HomeId",
                        column: x => x.HomeId,
                        principalTable: "OwnerHomeDetails",
                        principalColumn: "HomeId");
                    table.ForeignKey(
                        name: "FK_Bids_OwnerLandDetails_LandId",
                        column: x => x.LandId,
                        principalTable: "OwnerLandDetails",
                        principalColumn: "LandId");
                    table.ForeignKey(
                        name: "FK_Bids_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LandDocuments",
                columns: table => new
                {
                    LandDocumentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DocumentType = table.Column<int>(type: "int", nullable: true),
                    DocumentDetailsExtracted = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DocumentPath = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    LandId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LandDocuments", x => x.LandDocumentId);
                    table.ForeignKey(
                        name: "FK_LandDocuments_OwnerLandDetails_LandId",
                        column: x => x.LandId,
                        principalTable: "OwnerLandDetails",
                        principalColumn: "LandId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserLandApplications",
                columns: table => new
                {
                    ApplicationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LandId = table.Column<int>(type: "int", nullable: false),
                    OfferedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: true),
                    PurchasedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserLandApplications", x => x.ApplicationId);
                    table.ForeignKey(
                        name: "FK_UserLandApplications_OwnerLandDetails_LandId",
                        column: x => x.LandId,
                        principalTable: "OwnerLandDetails",
                        principalColumn: "LandId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserLandApplications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bids_HomeId",
                table: "Bids",
                column: "HomeId");

            migrationBuilder.CreateIndex(
                name: "IX_Bids_LandId",
                table: "Bids",
                column: "LandId");

            migrationBuilder.CreateIndex(
                name: "IX_Bids_UserId",
                table: "Bids",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_HomeDocuments_HomeId",
                table: "HomeDocuments",
                column: "HomeId");

            migrationBuilder.CreateIndex(
                name: "IX_LandDocuments_LandId",
                table: "LandDocuments",
                column: "LandId");

            migrationBuilder.CreateIndex(
                name: "IX_Loggers_UserId",
                table: "Loggers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_OwnerHomeDetails_UserId",
                table: "OwnerHomeDetails",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_OwnerLandDetails_UserId",
                table: "OwnerLandDetails",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserHomeApplications_HomeId",
                table: "UserHomeApplications",
                column: "HomeId");

            migrationBuilder.CreateIndex(
                name: "IX_UserHomeApplications_UserId",
                table: "UserHomeApplications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLandApplications_LandId",
                table: "UserLandApplications",
                column: "LandId");

            migrationBuilder.CreateIndex(
                name: "IX_UserLandApplications_UserId",
                table: "UserLandApplications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bids");

            migrationBuilder.DropTable(
                name: "HomeDocuments");

            migrationBuilder.DropTable(
                name: "LandDocuments");

            migrationBuilder.DropTable(
                name: "Loggers");

            migrationBuilder.DropTable(
                name: "UserHomeApplications");

            migrationBuilder.DropTable(
                name: "UserLandApplications");

            migrationBuilder.DropTable(
                name: "OwnerHomeDetails");

            migrationBuilder.DropTable(
                name: "OwnerLandDetails");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}