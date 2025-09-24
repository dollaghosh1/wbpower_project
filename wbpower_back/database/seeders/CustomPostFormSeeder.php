<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CustomPostForm;

class CustomPostFormSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CustomPostForm::insert([
            [
                'label' => 'Title',
                'type' => 'text',
                'options' => null,
                'required' => true,
            ],
            [
                'label' => 'Description',
                'type' => 'textarea',
                'options' => null,
                'required' => false,
            ],
            [
                'label' => 'Content',
                'type' => 'richtext', // CKEditor field
                'options' => null,
                'required' => true,
            ],
            [
                'label' => 'Thumbnail Image',
                'type' => 'image',
                'options' => null,
                'required' => false,
            ],
        ]);
    }
}
