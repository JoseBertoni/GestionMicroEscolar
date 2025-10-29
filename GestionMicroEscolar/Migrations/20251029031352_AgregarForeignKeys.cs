using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GestionMicroEscolar.Migrations
{
    /// <inheritdoc />
    public partial class AgregarForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Micros",
                columns: table => new
                {
                    Patente = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Micros", x => x.Patente);
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
                        principalColumn: "Patente",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Choferes",
                columns: table => new
                {
                    Dni = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MicroPatente = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Choferes", x => x.Dni);
                    table.ForeignKey(
                        name: "FK_Choferes_Micros_MicroPatente",
                        column: x => x.MicroPatente,
                        principalTable: "Micros",
                        principalColumn: "Patente",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Chicos_MicroPatente",
                table: "Chicos",
                column: "MicroPatente");

            migrationBuilder.CreateIndex(
                name: "IX_Choferes_MicroPatente",
                table: "Choferes",
                column: "MicroPatente",
                unique: true,
                filter: "[MicroPatente] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Chicos");

            migrationBuilder.DropTable(
                name: "Choferes");

            migrationBuilder.DropTable(
                name: "Micros");
        }
    }
}
