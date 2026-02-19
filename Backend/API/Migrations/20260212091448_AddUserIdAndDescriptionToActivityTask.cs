using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIdAndDescriptionToActivityTask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "ActivityTasks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "ActivityTasks",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.CreateIndex(
                name: "IX_ActivityTasks_UserId",
                table: "ActivityTasks",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ActivityTasks_Users_UserId",
                table: "ActivityTasks",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActivityTasks_Users_UserId",
                table: "ActivityTasks");

            migrationBuilder.DropIndex(
                name: "IX_ActivityTasks_UserId",
                table: "ActivityTasks");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "ActivityTasks");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ActivityTasks");
        }
    }
}