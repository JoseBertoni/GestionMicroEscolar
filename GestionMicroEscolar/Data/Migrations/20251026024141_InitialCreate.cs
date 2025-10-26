using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionMicroEscolar.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Choferes",
                columns: table => new
                {
                    Dni = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Choferes", x => x.Dni);
                });

            migrationBuilder.CreateTable(
                name: "Micros",
                columns: table => new
                {
                    Patente = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ChoferDni = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Micros", x => x.Patente);
                    table.ForeignKey(
                        name: "FK_Micros_Choferes_ChoferDni",
                        column: x => x.ChoferDni,
                        principalTable: "Choferes",
                        principalColumn: "Dni",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Chicos",
                columns: table => new
                {
                    Dni = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MicroPatente = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chicos", x => x.Dni);
                    table.ForeignKey(
                        name: "FK_Chicos_Micros_MicroPatente",
                        column: x => x.MicroPatente,
                        principalTable: "Micros",
                        principalColumn: "Patente");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Chicos_MicroPatente",
                table: "Chicos",
                column: "MicroPatente");

            migrationBuilder.CreateIndex(
                name: "IX_Micros_ChoferDni",
                table: "Micros",
                column: "ChoferDni",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Chicos");

            migrationBuilder.DropTable(
                name: "Micros");

            migrationBuilder.DropTable(
                name: "Choferes");
        }
    }
}
