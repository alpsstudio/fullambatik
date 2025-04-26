<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    public function generate(Request $request)
    {
        $prompt = $request->input('prompt');
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('STABILITY_API_KEY'),
            'Content-Type' => 'application/json',
        ])->post('https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image', [
            'cfg_scale' => 7,
            'clip_guidance_preset' => 'FAST_BLUE',
            'height' => 512,
            'width' => 512,
            'samples' => 1,
            'steps' => 30,
            'text_prompts' => [[ 'text' => $prompt ]],
        ]);

        $image = $response->json()['artifacts'][0]['base64'];
        return response()->json([
            'url' => 'data:image/png;base64,' . $image
        ]);
    }
}
