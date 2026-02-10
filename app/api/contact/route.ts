import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');
        const serviceType = formData.get('service_type');

        // Here you would typically save to DB or send email
        console.log('Contact Form Submission:', { name, email, phone, message, serviceType });

        // For now, return success
        return NextResponse.json({ status: 'success', message: 'Vaša poruka je uspešno poslata!' });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ status: 'error', message: 'Došlo je do greške.' }, { status: 500 });
    }
}
