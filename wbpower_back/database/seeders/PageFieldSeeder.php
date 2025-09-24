<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PageFieldSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FormField::create(['label' => 'Text', 'name' => 'text', 'type' => 'text']);
        FormField::create(['label' => 'Textarea', 'name' => 'textarea', 'type' => 'textarea']);
        FormField::create(['label' => 'Number', 'name' => 'number', 'type' => 'number']);
        FormField::create(['label' => 'Select', 'name' => 'select', 'type' => 'select']);
    }
}
