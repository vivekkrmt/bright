<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddForeignKeysToAuthRolePermissionsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table(config('bright.table.role_permissions'), function (Blueprint $table): void {
            $table->foreign('permission_id', 'role_permissions_permission_id_foreign')->references('id')->on(config('bright.table.permissions'))->onUpdate('RESTRICT')->onDelete('CASCADE');
            $table->foreign('role_id', 'role_permissions_role_id_foreign')->references('id')->on(config('bright.table.roles'))->onUpdate('RESTRICT')->onDelete('CASCADE');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table(config('bright.table.role_permissions'), function (Blueprint $table): void {
            $table->dropForeign('role_permissions_permission_id_foreign');
            $table->dropForeign('role_permissions_role_id_foreign');
        });
    }
}
