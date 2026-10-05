/**
 * GameArtwork - Handcrafted SVG App Icons for all 15 games.
 * Clean, modern vector illustrations with 3D gradients, specular highlights,
 * and authentic App Store quality graphics.
 */
export const GAME_ARTWORK = {
  'knife-hit': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="khWood" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FCD34D"/>
          <stop offset="70%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#92400E"/>
        </radialGradient>
        <linearGradient id="khBlade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="50%" stop-color="#CBD5E1"/>
          <stop offset="100%" stop-color="#64748B"/>
        </linearGradient>
      </defs>
      <!-- Target Log -->
      <circle cx="40" cy="34" r="26" fill="url(#khWood)" stroke="#78350F" stroke-width="2"/>
      <circle cx="40" cy="34" r="18" fill="none" stroke="#B45309" stroke-width="1.5" stroke-dasharray="3 3"/>
      <circle cx="40" cy="34" r="9" fill="#78350F"/>
      <circle cx="40" cy="34" r="3" fill="#FDE68A"/>
      <!-- Embedded Knife -->
      <rect x="38" y="10" width="4" height="16" rx="2" fill="url(#khBlade)"/>
      <rect x="37" y="2" width="6" height="9" rx="1.5" fill="#EF4444"/>
      <!-- Flying Knife -->
      <g transform="translate(40, 60)">
        <polygon points="0,-12 4,2 0,0 -4,2" fill="url(#khBlade)"/>
        <rect x="-1.5" y="0" width="3" height="8" rx="1" fill="#1E293B"/>
        <circle cx="0" cy="10" r="2" fill="#D97706"/>
      </g>
    </svg>
  `,

  'fruit-snake': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="snkBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34D399"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
        <radialGradient id="snkApple" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#F87171"/>
          <stop offset="70%" stop-color="#EF4444"/>
          <stop offset="100%" stop-color="#991B1B"/>
        </radialGradient>
      </defs>
      <!-- Snake Tail & Curves -->
      <path d="M18 56 C14 44, 26 36, 36 40 C46 44, 52 32, 46 22 C42 16, 34 16, 28 22" 
            stroke="url(#snkBody)" stroke-width="9" stroke-linecap="round" fill="none"/>
      <!-- Snake Head -->
      <circle cx="28" cy="22" r="7" fill="#10B981"/>
      <circle cx="26" cy="20" r="2" fill="#FFFFFF"/>
      <circle cx="26.5" cy="20.5" r="1.2" fill="#064E3B"/>
      <!-- Ripe Apple -->
      <circle cx="58" cy="48" r="11" fill="url(#snkApple)"/>
      <path d="M58 37 C60 33, 63 33, 65 35" stroke="#78350F" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="63" cy="35" rx="3.5" ry="1.8" fill="#10B981" transform="rotate(-30 63 35)"/>
      <circle cx="55" cy="45" r="2.5" fill="#FFFFFF" opacity="0.6"/>
    </svg>
  `,

  'color-bounce': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cbBall" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="40%" stop-color="#38BDF8"/>
          <stop offset="100%" stop-color="#0284C7"/>
        </radialGradient>
      </defs>
      <!-- 4-Quadrant Color Ring -->
      <circle cx="40" cy="38" r="24" stroke="#F43F5E" stroke-width="6" stroke-dasharray="35 120" stroke-linecap="round"/>
      <circle cx="40" cy="38" r="24" stroke="#FBBF24" stroke-width="6" stroke-dasharray="35 120" stroke-dashoffset="-38" stroke-linecap="round"/>
      <circle cx="40" cy="38" r="24" stroke="#10B981" stroke-width="6" stroke-dasharray="35 120" stroke-dashoffset="-76" stroke-linecap="round"/>
      <circle cx="40" cy="38" r="24" stroke="#38BDF8" stroke-width="6" stroke-dasharray="35 120" stroke-dashoffset="-114" stroke-linecap="round"/>
      <!-- Bouncing Sphere with Core Glow -->
      <circle cx="40" cy="38" r="8" fill="url(#cbBall)"/>
      <circle cx="38" cy="36" r="2" fill="#FFFFFF"/>
      <path d="M40 50 L40 58" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    </svg>
  `,

  'tower-stack': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tsB1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#C084FC"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient>
        <linearGradient id="tsB2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#818CF8"/><stop offset="100%" stop-color="#4F46E5"/></linearGradient>
        <linearGradient id="tsB3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#38BDF8"/><stop offset="100%" stop-color="#0284C7"/></linearGradient>
      </defs>
      <!-- Base Block -->
      <rect x="18" y="52" width="44" height="12" rx="3" fill="url(#tsB1)"/>
      <rect x="20" y="53" width="40" height="2" fill="#FFFFFF" opacity="0.4"/>
      <!-- Middle Block -->
      <rect x="22" y="38" width="36" height="12" rx="3" fill="url(#tsB2)"/>
      <rect x="24" y="39" width="32" height="2" fill="#FFFFFF" opacity="0.4"/>
      <!-- Top Sliding Block -->
      <rect x="26" y="24" width="28" height="12" rx="3" fill="url(#tsB3)"/>
      <rect x="28" y="25" width="24" height="2" fill="#FFFFFF" opacity="0.5"/>
      <!-- Perfect Slice Sparkle -->
      <polygon points="56,22 58,28 64,30 58,32 56,38 54,32 48,30 54,28" fill="#FDE047"/>
    </svg>
  `,

  'flappy-aviator': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="faBird" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="60%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#D97706"/>
        </radialGradient>
      </defs>
      <!-- Obstacle Pillars -->
      <rect x="52" y="10" width="14" height="20" rx="3" fill="#10B981" stroke="#059669" stroke-width="2"/>
      <rect x="52" y="50" width="14" height="20" rx="3" fill="#10B981" stroke="#059669" stroke-width="2"/>
      <!-- Aviator Bird -->
      <circle cx="28" cy="38" r="13" fill="url(#faBird)"/>
      <ellipse cx="23" cy="40" rx="6" ry="4" fill="#FBBF24"/>
      <!-- Aviator Goggles -->
      <rect x="26" y="31" width="13" height="7" rx="3.5" fill="#38BDF8" stroke="#0F172A" stroke-width="1.8"/>
      <circle cx="31" cy="34.5" r="1.5" fill="#FFFFFF"/>
      <!-- Orange Beak -->
      <polygon points="38,36 46,39 38,42" fill="#EA580C"/>
    </svg>
  `,

  'game-2048': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g2048Grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FDE047"/>
          <stop offset="50%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
      </defs>
      <!-- 2x2 Grid Background -->
      <rect x="14" y="14" width="52" height="52" rx="10" fill="#E2E8F0"/>
      <!-- Sub Tiles -->
      <rect x="18" y="18" width="21" height="21" rx="5" fill="#F8FAFC"/>
      <rect x="41" y="18" width="21" height="21" rx="5" fill="#EEF2FF"/>
      <rect x="18" y="41" width="21" height="21" rx="5" fill="#FEF3C7"/>
      <!-- Champion Gold Tile -->
      <rect x="36" y="36" width="28" height="28" rx="6" fill="url(#g2048Grad)"/>
      <text x="50" y="54" font-family="'Sora', sans-serif" font-weight="900" font-size="10" fill="#FFFFFF" text-anchor="middle">2048</text>
    </svg>
  `,

  'dunk-shot': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dsBall" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FB923C"/>
          <stop offset="60%" stop-color="#EA580C"/>
          <stop offset="100%" stop-color="#9A3412"/>
        </radialGradient>
      </defs>
      <!-- Hoop Rim & Net -->
      <ellipse cx="54" cy="44" rx="14" ry="4" stroke="#EF4444" stroke-width="3" fill="none"/>
      <path d="M41 44 L46 64 L54 66 L62 64 L67 44" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="2 2" fill="none"/>
      <!-- Parabolic Aim Trajectory -->
      <path d="M18 58 Q34 20 48 34" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="3 3" fill="none"/>
      <!-- Basketball -->
      <circle cx="22" cy="50" r="10" fill="url(#dsBall)"/>
      <circle cx="22" cy="50" r="10" stroke="#7C2D12" stroke-width="1.2" fill="none"/>
      <path d="M12 50 C18 48 26 48 32 50" stroke="#7C2D12" stroke-width="1"/>
      <path d="M22 40 C20 46 20 54 22 60" stroke="#7C2D12" stroke-width="1"/>
    </svg>
  `,

  'highway-racer': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hrCar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F43F5E"/>
          <stop offset="100%" stop-color="#BE123C"/>
        </linearGradient>
      </defs>
      <!-- Asphalt Road & Speed Lines -->
      <rect x="18" y="10" width="44" height="60" rx="4" fill="#334155"/>
      <line x1="32" y1="14" x2="32" y2="66" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6 6" opacity="0.7"/>
      <line x1="48" y1="14" x2="48" y2="66" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6 6" opacity="0.7"/>
      <!-- Supercar Silhouette -->
      <g transform="translate(40, 44)">
        <!-- Tires -->
        <rect x="-10" y="-12" width="4" height="7" rx="1.5" fill="#0F172A"/>
        <rect x="6" y="-12" width="4" height="7" rx="1.5" fill="#0F172A"/>
        <rect x="-10" y="8" width="4" height="7" rx="1.5" fill="#0F172A"/>
        <rect x="6" y="8" width="4" height="7" rx="1.5" fill="#0F172A"/>
        <!-- Chassis -->
        <rect x="-8" y="-14" width="16" height="28" rx="5" fill="url(#hrCar)"/>
        <!-- Windshield -->
        <polygon points="-5,-4 5,-4 4,3 -4,3" fill="#38BDF8"/>
        <!-- Headlights -->
        <rect x="-6" y="-14" width="3" height="2" rx="1" fill="#FDE047"/>
        <rect x="3" y="-14" width="3" height="2" rx="1" fill="#FDE047"/>
      </g>
    </svg>
  `,

  'brick-breaker': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bbPad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#06B6D4"/><stop offset="100%" stop-color="#3B82F6"/></linearGradient>
      </defs>
      <!-- Neon Brick Grid -->
      <rect x="18" y="16" width="12" height="7" rx="2" fill="#F43F5E"/>
      <rect x="34" y="16" width="12" height="7" rx="2" fill="#F59E0B"/>
      <rect x="50" y="16" width="12" height="7" rx="2" fill="#10B981"/>
      <rect x="18" y="26" width="12" height="7" rx="2" fill="#8B5CF6"/>
      <rect x="34" y="26" width="12" height="7" rx="2" fill="#EC4899"/>
      <rect x="50" y="26" width="12" height="7" rx="2" fill="#38BDF8"/>
      <!-- Energy Laser Orb -->
      <circle cx="38" cy="46" r="4.5" fill="#FFFFFF" stroke="#00F2FE" stroke-width="2"/>
      <!-- Paddle -->
      <rect x="24" y="60" width="32" height="7" rx="3.5" fill="url(#bbPad)"/>
      <rect x="26" y="61" width="28" height="1.5" fill="#FFFFFF" opacity="0.6"/>
    </svg>
  `,

  'whack-a-mole': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="wmHole" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#1E293B"/>
          <stop offset="100%" stop-color="#475569"/>
        </radialGradient>
      </defs>
      <!-- Bunker Mound / Hole -->
      <ellipse cx="40" cy="54" rx="24" ry="10" fill="url(#wmHole)"/>
      <ellipse cx="40" cy="54" rx="20" ry="7" fill="#0F172A"/>
      <!-- Smiling Robot Mole Popping Out -->
      <g transform="translate(40, 42)">
        <rect x="-12" y="-16" width="24" height="20" rx="8" fill="#FBBF24"/>
        <circle cx="-5" cy="-8" r="2.5" fill="#1E293B"/>
        <circle cx="5" cy="-8" r="2.5" fill="#1E293B"/>
        <path d="M-4 -1 Q0 3 4 -1" stroke="#1E293B" stroke-width="1.8" stroke-linecap="round"/>
        <!-- Antenna -->
        <line x1="0" y1="-16" x2="0" y2="-22" stroke="#64748B" stroke-width="2"/>
        <circle cx="0" cy="-22" r="3" fill="#EF4444"/>
      </g>
      <!-- Mallet / Hammer Swing -->
      <g transform="translate(56, 26) rotate(35)">
        <rect x="-4" y="-8" width="8" height="16" rx="2" fill="#D97706"/>
        <rect x="-2" y="8" width="4" height="16" rx="1" fill="#78350F"/>
      </g>
    </svg>
  `,

  'memory-matrix': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mmCard1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#C084FC"/><stop offset="100%" stop-color="#8B5CF6"/></linearGradient>
        <linearGradient id="mmCard2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#38BDF8"/><stop offset="100%" stop-color="#4F46E5"/></linearGradient>
      </defs>
      <!-- Left Card (Revealed Star) -->
      <g transform="translate(26, 40) rotate(-10)">
        <rect x="-13" y="-18" width="26" height="36" rx="4" fill="url(#mmCard1)" stroke="#FFFFFF" stroke-width="1.5"/>
        <polygon points="0,-7 2,-2 7,-2 3,2 5,7 0,4 -5,7 -3,2 -7,-2 -2,-2" fill="#FEF08A"/>
      </g>
      <!-- Right Card (Revealed Star Match!) -->
      <g transform="translate(52, 40) rotate(12)">
        <rect x="-13" y="-18" width="26" height="36" rx="4" fill="url(#mmCard2)" stroke="#FFFFFF" stroke-width="1.5"/>
        <polygon points="0,-7 2,-2 7,-2 3,2 5,7 0,4 -5,7 -3,2 -7,-2 -2,-2" fill="#FEF08A"/>
      </g>
      <!-- Sparkle Celebration -->
      <polygon points="40,20 42,24 46,26 42,28 40,32 38,28 34,26 38,24" fill="#FBBF24"/>
    </svg>
  `,

  'zigzag-runner': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="zzPath" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F472B6"/><stop offset="100%" stop-color="#DB2777"/></linearGradient>
      </defs>
      <!-- Floating Isometric ZigZag Road -->
      <path d="M16 62 L34 50 L34 36 L52 24 L64 32" stroke="url(#zzPath)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M16 62 L34 50 L34 36 L52 24 L64 32" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.4"/>
      <!-- Glowing Diamond Runner -->
      <g transform="translate(42, 30)">
        <polygon points="0,-7 7,0 0,7 -7,0" fill="#FDE047" stroke="#EA580C" stroke-width="1.5"/>
      </g>
    </svg>
  `,

  'tictactoe-ai': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 3x3 Minimalist Pastel Grid -->
      <line x1="31" y1="18" x2="31" y2="62" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="49" y1="18" x2="49" y2="62" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="18" y1="31" x2="62" y2="31" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="18" y1="49" x2="62" y2="49" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Glowing X Marks -->
      <g stroke="#4F46E5" stroke-width="3.5" stroke-linecap="round">
        <line x1="21" y1="21" x2="28" y2="28"/>
        <line x1="28" y1="21" x2="21" y2="28"/>
        <line x1="36" y1="36" x2="44" y2="44"/>
        <line x1="44" y1="36" x2="36" y2="44"/>
      </g>
      <!-- Radiant O Ring -->
      <circle cx="55" cy="55" r="5" stroke="#F43F5E" stroke-width="3" fill="none"/>
      <!-- Victory Strike Line -->
      <line x1="18" y1="18" x2="62" y2="62" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,

  'pong-rally': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Table Tennis Net -->
      <line x1="40" y1="14" x2="40" y2="66" stroke="#E2E8F0" stroke-width="2" stroke-dasharray="4 4"/>
      <!-- Blue Paddle (Left) -->
      <rect x="18" y="24" width="6" height="24" rx="3" fill="#0284C7"/>
      <!-- Coral Paddle (Right) -->
      <rect x="56" y="34" width="6" height="24" rx="3" fill="#F43F5E"/>
      <!-- High Speed Ball & Motion Arc -->
      <path d="M26 36 Q38 48 54 44" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="2 2" fill="none"/>
      <circle cx="36" cy="42" r="4.5" fill="#FFFFFF" stroke="#0F172A" stroke-width="1"/>
      <circle cx="35" cy="41" r="1.5" fill="#FFFFFF"/>
    </svg>
  `,

  'space-defender': `
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ssShip" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38BDF8"/><stop offset="100%" stop-color="#4F46E5"/></linearGradient>
      </defs>
      <!-- Twinkling Stars -->
      <circle cx="20" cy="18" r="1" fill="#94A3B8"/>
      <circle cx="62" cy="22" r="1.5" fill="#94A3B8"/>
      <circle cx="56" cy="56" r="1" fill="#94A3B8"/>
      <!-- Twin Plasma Blasts -->
      <line x1="36" y1="28" x2="36" y2="16" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="44" y1="28" x2="44" y2="16" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Sci-Fi Starfighter Craft -->
      <g transform="translate(40, 48)">
        <!-- Thruster Flame -->
        <polygon points="-3,14 0,22 3,14" fill="#F97316"/>
        <polygon points="-1.5,14 0,18 1.5,14" fill="#FDE047"/>
        <!-- Hull & Wings -->
        <polygon points="0,-16 14,8 7,12 0,9 -7,12 -14,8" fill="url(#ssShip)"/>
        <!-- Cockpit Canopy -->
        <ellipse cx="0" cy="-2" rx="3" ry="6" fill="#38BDF8"/>
        <circle cx="0" cy="-4" r="1.5" fill="#FFFFFF"/>
      </g>
    </svg>
  `
};
