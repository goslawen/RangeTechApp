using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RangeTech.ServiceApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueDeviceSerialNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                ;WITH DuplicateDevices AS (
                    SELECT
                        [Id],
                        ROW_NUMBER() OVER (
                            PARTITION BY LOWER(LTRIM(RTRIM([SerialNumber])))
                            ORDER BY [Id]
                        ) AS [DuplicateNumber]
                    FROM [Devices]
                )
                UPDATE [Devices]
                SET [SerialNumber] = LEFT([Devices].[SerialNumber], 107) + '-DUP-' + LEFT(CONVERT(nvarchar(36), [Devices].[Id]), 8)
                FROM [Devices]
                INNER JOIN [DuplicateDevices] ON [Devices].[Id] = [DuplicateDevices].[Id]
                WHERE [DuplicateDevices].[DuplicateNumber] > 1;
                """);

            migrationBuilder.CreateIndex(
                name: "IX_Devices_SerialNumber",
                table: "Devices",
                column: "SerialNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Devices_SerialNumber",
                table: "Devices");
        }
    }
}
