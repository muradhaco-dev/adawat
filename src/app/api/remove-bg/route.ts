import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const REMOVE_BG_ENDPOINT = 'https://api.remove.bg/v1.0/removebg';
const DEFAULT_API_KEY = 't9yVMcDBuTkc9bbVNafmuadY';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.REMOVE_BG_API_KEY || DEFAULT_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing remove.bg API Key', message: 'مفتاح remove.bg غير متوفر في الخادم' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const imageFile = formData.get('image_file');

    if (!imageFile || !(imageFile instanceof Blob)) {
      return NextResponse.json(
        { error: 'No image provided', message: 'يرجى اختيار صورة صالحة للمعالجة' },
        { status: 400 }
      );
    }

    // Prepare outbound FormData to remove.bg API
    const outboundFormData = new FormData();
    outboundFormData.append('image_file', imageFile);
    outboundFormData.append('size', 'auto');

    // Send request to remove.bg
    const removeBgRes = await fetch(REMOVE_BG_ENDPOINT, {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: outboundFormData,
    });

    // Handle Error Responses from remove.bg
    if (!removeBgRes.ok) {
      let errorDetail = 'فشل في معالجة الصورة';
      try {
        const errorJson = await removeBgRes.json();
        const firstError = errorJson.errors?.[0];
        if (firstError) {
          if (firstError.title?.toLowerCase().includes('credit') || removeBgRes.status === 402) {
            errorDetail = 'تم استنفاد رصيد مفتاح remove.bg الحالي (Insufficient Credits). يرجى شحن الرصيد أو تحديث المفتاح.';
          } else if (removeBgRes.status === 403) {
            errorDetail = 'مفتاح API الخاص بـ remove.bg غير صالح أو تم إلغاؤه (Invalid API Key).';
          } else {
            errorDetail = `${firstError.title || 'خطأ'}: ${firstError.detail || ''}`;
          }
        }
      } catch {
        errorDetail = `خطأ من سيرفر remove.bg (كود: ${removeBgRes.status})`;
      }

      return NextResponse.json(
        { 
          error: true, 
          status: removeBgRes.status, 
          message: errorDetail 
        },
        { status: removeBgRes.status }
      );
    }

    // Receive PNG binary buffer
    const arrayBuffer = await removeBgRes.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store, max-age=0',
        'X-Powered-By': 'remove.bg-official-api',
      },
    });

  } catch (error: any) {
    console.error('Error in remove.bg API proxy:', error);
    return NextResponse.json(
      { 
        error: true, 
        message: error.message || 'حدث خطأ في الاتصال بسيرفر remove.bg' 
      },
      { status: 500 }
    );
  }
}
