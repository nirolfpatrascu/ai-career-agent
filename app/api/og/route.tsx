import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #0A0A0A 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Gradient accent circle */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,137,10,0.3) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,137,10,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #E8890A, #F5A623)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 800,
              color: 'white',
            }}
          >
            G
          </div>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-1px',
            }}
          >
            GapZero
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 600,
            color: '#E8890A',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          AI Career Gap Analysis & Career Roadmap
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.6)',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.5,
          }}
        >
          Upload your CV, get a personalized career strategy in under 2 minutes.
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '40px',
          }}
        >
          {['Gap Analysis', 'Salary Data', 'ATS Score', 'Action Plan', 'AI Coach'].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(232,137,10,0.3)',
                  background: 'rgba(232,137,10,0.1)',
                  color: '#E8890A',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                {feature}
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '18px',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          gapzero.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
