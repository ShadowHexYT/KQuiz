// Favorites and bias picks are seeded defaults for v1 and can be customized later.
function getStableHash(value) {
  return Array.from(value).reduce((hash, char) => hash + char.charCodeAt(0), 0);
}

function getShuffledChoices(choices, seed) {
  return [...choices].sort((left, right) => {
    const leftScore = getStableHash(`${seed}-${left}`);
    const rightScore = getStableHash(`${seed}-${right}`);
    return leftScore - rightScore;
  });
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const songMetaLibrary = {
  "IVE::Rebel Heart": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/26/c5/38/26c5381f-2dcb-cc8f-c161-60009a3c4d97/199066086087.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/32/74/05/3274059e-cd56-6149-6879-1eadba98704d/mzaf_3829637146046662884.plus.aac.p.m4a",
  },
  "IVE::Accendio": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/33/6d/b4/336db418-00ea-9570-1aa5-2541c07e582e/198391557965.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fe/fd/2b/fefd2be3-b963-37e2-1db6-5b648274fe75/mzaf_8434992173599027208.plus.aac.p.m4a",
  },
  "IVE::Bang Bang": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cd/8b/c2/cd8bc294-4ff3-d952-1bc1-4fb03ed9c4bc/199806248171.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/52/f2/e3/52f2e3c3-4193-9276-61b2-4d41dafca603/mzaf_16657816216153694111.plus.aac.p.m4a",
  },
  "IVE::Baddie": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2e/a2/87/2ea2870f-9700-bb4e-df68-abd2acfb5fb9/197189809583.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/76/1b/b7/761bb77b-e8f1-8e02-2c63-e77f39281c21/mzaf_6248546002557999331.plus.aac.p.m4a",
  },
  "IVE::After Like": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/01/f5/0a/01f50af1-89da-cb51-a809-c613600451e9/196925429900.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/af/78/11/af78116e-4e31-2cf6-faf6-e62ca99d7196/mzaf_4773771462355548204.plus.aac.p.m4a",
  },
  "IVE::Wave": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/49/4e/4c/494e4cc9-7a4b-e188-1f29-fcd4c0d1db29/4547366622553.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/4e/54/1d/4e541dd9-d1ab-16f2-c5f7-85f9402e22d4/mzaf_4474017503175861038.plus.aac.p.m4a",
  },
  "NMIXX::Run for Roses": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/58/67/42/58674202-0971-b51e-df73-b5695cfadd6e/8809928950259_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/08/09/f7/0809f720-00c1-ba6f-d352-4a9505532013/mzaf_16999834240296235600.plus.aac.p.m4a",
  },
  "NMIXX::Blue Valentine": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a7/5d/54/a75d54db-b997-d410-b6dd-25f7e766392a/8809928955148_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/42/0c/58/420c58be-a3d9-bb61-2a3a-ecd321957c73/mzaf_14878337150019931313.plus.aac.p.m4a",
  },
  "NMIXX::Shape of Love": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a7/5d/54/a75d54db-b997-d410-b6dd-25f7e766392a/8809928955148_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/fd/b0/76/fdb07641-c510-fbd1-7a83-c9ca057d79da/mzaf_2759080325366814622.plus.aac.p.m4a",
  },
  "NMIXX::RICO": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a7/5d/54/a75d54db-b997-d410-b6dd-25f7e766392a/8809928955148_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c0/56/42/c0564285-9293-206c-b11f-8d196fcf5338/mzaf_8216046666570181280.plus.aac.p.m4a",
  },
  "LE SSERAFIM::No Celestial": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c8/79/da/c879dadf-db1e-95a5-caf5-b18c7c81d2b6/192641874413_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/90/f7/83/90f78386-fabd-1cc2-88d6-693536bf6806/mzaf_11179683112933547147.plus.aac.p.m4a",
  },
  "LE SSERAFIM::Fire in the Belly": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/27/13/c3/2713c389-4f01-b5e7-59f5-3204b37cb594/196922444470_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/aa/85/7b/aa857b7a-0153-c825-e2a2-c94ae12419c6/mzaf_9429438750623879414.plus.aac.p.m4a",
  },
  "LE SSERAFIM::Ash": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/cb/5d/2c/cb5d2c9e-74e1-a562-6c40-04479aa0afdf/198704375187_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bd/55/21/bd55216b-b25c-7a3f-38f8-4e71eaf8ade0/mzaf_15301374454668181561.plus.aac.p.m4a",
  },
  "LE SSERAFIM::HOT": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c4/8d/56/c48d562d-c96d-00f3-291b-74df61a69b66/198704413872_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ba/ad/05/baad0579-4428-1877-f971-7e1950737fdf/mzaf_4615735336106225046.plus.aac.p.m4a",
  },
  "LE SSERAFIM::Swan Song": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/22/0f/fd/220ffdbf-152c-5b65-d5af-01256c1328c2/196922796531_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/cb/82/6f/cb826f2e-96b8-462e-a01e-a90470a7a43b/mzaf_10944003730126806103.plus.aac.p.m4a",
  },
  "LE SSERAFIM::Different": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a6/d9/39/a6d9396e-bc27-d1d8-afdd-269540ff46e2/25UMGIM74307.rgb.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/38/41/16/38411667-96be-6bbf-60f7-89df4244d38b/mzaf_11720761550331603446.plus.aac.p.m4a",
  },
  "NewJeans::ETA": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/4b/7e/d34b7e1e-af3b-43b6-2949-7a8c652a1bc9/196922462726_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fb/eb/dc/fbebdc04-d035-0b34-6df7-7c7e73e1c5ce/mzaf_1666920854414573023.plus.aac.p.m4a",
  },
  "NewJeans::GODS": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/30/59/e0/3059e000-eb6f-6c08-4387-c1ee9d38d962/00198704670657_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5d/74/e8/5d74e868-ad58-7d2c-64e5-8b977fcd4292/mzaf_1734851894013012378.plus.aac.p.m4a",
  },
  "NewJeans::Hype Boy": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4e/64/34/4e64344b-3ac6-c503-2c41-257a15401416/192641873096_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/85/f3/08/85f30899-e93c-35e2-4742-df57fc2d3552/mzaf_14134842621180071043.plus.aac.p.m4a",
  },
  "VIVIZ::Untie": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/42/5a/20/425a2026-a87d-7e6a-26d9-4159de176762/8804775284434_cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/83/ba/be/83babebd-86c7-423c-cfce-de0a1786cddd/mzaf_7422046161284290284.plus.aac.p.m4a",
  },
  "VIVIZ::Cliche": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/0c/67/79/0c677933-7963-c36a-d6dd-cfc713b0c7af/8804775376245_cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ea/81/a1/ea81a1e9-8a43-a8b2-9afe-1a43e29d665c/mzaf_2148053734967021397.plus.aac.p.m4a",
  },
  "VIVIZ::MANIAC": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/42/5a/20/425a2026-a87d-7e6a-26d9-4159de176762/8804775284434_cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/50/8b/7b/508b7bf0-b15f-e264-aacb-8e64bfa94231/mzaf_2779178614846379274.plus.aac.p.m4a",
  },
  "aespa::Whiplash": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d5/c1/f5/d5c1f505-f588-775f-df05-c672a8ec22e9/888735949562_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7d/1b/a1/7d1ba15e-19fb-0411-e503-61e4379abd10/mzaf_16342830676435185944.plus.aac.p.m4a",
  },
  "aespa::Girls": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/c9/7d/dd/c97ddd34-5962-8cf1-a55c-cf730d3069f5/888735941375.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d4/4a/e3/d44ae3a2-4f55-1fe8-d3a0-ad8ad9bd7f01/mzaf_17549441330329370006.plus.aac.p.m4a",
  },
  "aespa::Drama": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/f7/f0/5c/f7f05ce4-e5a4-900d-e087-1dd9668b2b34/888735945939.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1f/dc/9b/1fdc9b25-04dd-515c-b5da-8dc132ed39b6/mzaf_5682330302212897053.plus.aac.p.m4a",
  },
  "aespa::Hold On Tight": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/1c/94/50/1c9450ab-f829-f57c-fec0-72d57cb2ac01/5054197603907.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4d/4e/72/4d4e72b2-e9ae-afc1-4b71-0340c66f7144/mzaf_11372576086804452516.plus.aac.p.m4a",
  },
  "STAYC::Young Luv": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e7/37/29/e73729f2-ec82-295d-40d0-3025b9f251d8/cover_KM0014771_1.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1d/7f/87/1d7f8778-7622-09e0-257f-d3a4dca0aa9f/mzaf_5191776639629169420.plus.aac.p.m4a",
  },
  "STAYC::Bubble": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c6/fa/fa/c6fafa66-b751-661b-3819-4bf77608b690/cover_KM0017996_1.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c7/40/d8/c740d8be-7997-562c-3759-7d3d2cdb120e/mzaf_8245578181193888387.plus.aac.p.m4a",
  },
  "STAYC::RUN2U": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e7/37/29/e73729f2-ec82-295d-40d0-3025b9f251d8/cover_KM0014771_1.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9e/58/0e/9e580e6a-0ceb-a651-9fc2-6a9bcb023c06/mzaf_3281702184395669178.plus.aac.p.m4a",
  },
  "STAYC::Stay WITH me": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/90/83/de/9083def4-0817-a40d-d30f-87a691f9c31d/cover_KM0020019_1.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9b/9e/8e/9b9e8e51-8af5-0563-a5c2-550e57374f77/mzaf_1612285389425143817.plus.aac.p.m4a",
  },
  "STAYC::Cheeky Icy Thang": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/90/83/de/9083def4-0817-a40d-d30f-87a691f9c31d/cover_KM0020019_1.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/69/56/4d/69564da8-cc84-bebc-310e-6b0f9348fc52/mzaf_13947466064822628519.plus.aac.p.m4a",
  },
  "STAYC::BEBE": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/17/30/df/1730dfb5-4d53-04d7-0bc9-6802a980903d/cover_KM0021351_1.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/36/b5/82/36b5826b-04ca-9c3b-1e9f-826c70525524/mzaf_6396367006477327293.plus.aac.p.m4a",
  },
  "Kiss of Life::Midas Touch": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e1/6f/c2/e16fc273-6872-31a0-a667-3e8777da2636/8804775348402.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/21/3c/2e/213c2ee6-ec6a-b00d-fcec-9c10bb6836a2/mzaf_7872828880278104227.plus.aac.p.m4a",
  },
  "Kiss of Life::k bye": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f9/43/eb/f943ebb7-ab2d-fdcc-9ab3-f72b6a49d7b0/8804775400384.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c4/c7/93/c4c79392-8b01-97d8-cd5d-c7dee55054ab/mzaf_16227540352800253274.plus.aac.p.m4a",
  },
  "Kiss of Life::igloo": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/dd/70/86/dd70863e-2571-25cd-d1eb-c44a5cdba57f/cover_KM0020274_1.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/50/54/92/5054924b-e57d-eb22-ff9d-5549d67e7c62/mzaf_4552197013183434371.plus.aac.p.m4a",
  },
  "Kiss of Life::Te Quiero": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9b/00/c7/9b00c7e0-2e78-af06-bcfe-89d7a00e5a6d/cover_KM0019987_1.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/72/ca/24/72ca2445-900b-4fbf-1004-0423cb98ac1e/mzaf_401764176605268277.plus.aac.p.m4a",
  },
  "Kiss of Life::Tell me": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f9/43/eb/f943ebb7-ab2d-fdcc-9ab3-f72b6a49d7b0/8804775400384.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/54/20/75/54207534-1749-61cf-f9b8-ee3c1e4b2193/mzaf_7506468722076593210.plus.aac.p.m4a",
  },
  "BabyMonster::Hot Sauce": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d6/82/b4/d682b4f1-cc18-237f-361e-d735e36ae034/8809519880699_cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4b/c2/c5/4bc2c54b-516b-b928-d50c-1ffe47e68d4e/mzaf_6294838365327343014.plus.aac.p.m4a",
  },
  "BabyMonster::Sheesh": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fb/68/85/fb68856f-4965-5d30-78ea-fe6bb261f4ff/3000px.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/e8/0e/20/e80e2080-c1e6-f616-bec0-82fbd530da09/mzaf_402899695312688427.plus.aac.p.m4a",
  },
  "BabyMonster::Psycho": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/dc/2c/91/dc2c911c-4860-2834-2fc8-3d1d55f077d8/8809519880989_cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f7/46/b0/f746b0bd-aa60-11aa-3db7-fce145c8283c/mzaf_2493928520448820176.plus.aac.p.m4a",
  },
  "BabyMonster::Like That": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fb/68/85/fb68856f-4965-5d30-78ea-fe6bb261f4ff/3000px.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cb/d5/39/cbd5392e-9927-3d98-ed93-72daa276c167/mzaf_5581836805629505335.plus.aac.p.m4a",
  },
  "BabyMonster::Really Like You": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b9/e1/ef/b9e1ef3a-e3eb-8152-e91b-20aca0fc9ffd/BM_DRIP_Digital-Cover_4000.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4e/e9/01/4ee90181-000b-3138-d476-991a5d2190fe/mzaf_988779685436638231.plus.aac.p.m4a",
  },
  "BabyMonster::Billionaire": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b9/e1/ef/b9e1ef3a-e3eb-8152-e91b-20aca0fc9ffd/BM_DRIP_Digital-Cover_4000.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/98/59/74/98597469-4523-1930-d15f-87d2686fe7a4/mzaf_17193729230949250035.plus.aac.p.m4a",
  },
  "ITZY::Ringo": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/27/76/3e/27763e4c-0c29-96f2-10e2-55bfe83ed1ce/5054197790782.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9f/ff/a8/9fffa80f-463f-8572-c5fe-51169a3940ee/mzaf_14014407130866905125.plus.aac.p.m4a",
  },
  "ITZY::Wannabe": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/40/b0/1a/40b01aff-1aa6-5dda-4263-00384501ae35/192641939570_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/c6/40/82/c64082d5-55c5-0b6d-fab5-a2d44246da34/mzaf_18339168541805988052.plus.aac.p.m4a",
  },
  "ITZY::Mafia in the morning": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e8/41/c4/e841c413-9eab-b493-fd8e-3fe655b82387/192641939617_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/a3/ce/a7/a3cea7f2-9023-fecd-229b-de72994310cc/mzaf_5631480869270575414.plus.aac.p.m4a",
  },
  "ITZY::Loco": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e7/f3/d7/e7f3d7dc-4bf6-e15d-ca28-3105f713e693/192641938573_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/22/08/12/22081232-0b9e-c386-517a-bd0ab0861d98/mzaf_8179992255405158463.plus.aac.p.m4a",
  },
  "ITZY::Untouchable": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/08/1e/ff/081effcc-4f11-0b73-d131-bef7d49fb6e8/8809928950150_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/63/82/d2/6382d275-0f4e-2c96-352a-2bc0a930c29f/mzaf_12464342165696668076.plus.aac.p.m4a",
  },
  "G-(I)DLE::My Bag": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4c/da/91/4cda91b0-6fa2-805e-fd1a-e89bf87bb969/8804775250422.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/41/98/c6/4198c633-91a6-c30e-3721-4de3edfef58f/mzaf_5052307963057652165.plus.aac.p.m4a",
  },
  "G-(I)DLE::Senorita": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/ca/ff/39/caff3985-2be7-47fe-7104-7918c2906569/cover-.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/c8/e0/67/c8e0677f-e974-c710-89d3-afca60f26b6d/mzaf_18094329123996466748.plus.aac.p.m4a",
  },
  "G-(I)DLE::Tomboy": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4c/da/91/4cda91b0-6fa2-805e-fd1a-e89bf87bb969/8804775250422.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/da/37/14/da3714a4-b9cd-78ea-590e-bae5af9f3856/mzaf_9300426931010299319.plus.aac.p.m4a",
  },
  "G-(I)DLE::Eyes Roll": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/64/a0/4f/64a04f8f-2e5c-c0c2-e930-8e6434f2411f/93624850601.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/61/21/6c/61216c6b-b26b-00ae-1818-69fbaadde3f8/mzaf_679243903782250937.plus.aac.p.m4a",
  },
  "G-(I)DLE::Paradise": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7b/59/56/7b59565a-c6bd-a615-9cc2-955cb8481dfb/8804775254703.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b7/63/37/b7633777-8d98-fac1-2f78-4b724a1eae66/mzaf_4652687052265589683.plus.aac.p.m4a",
  },
  "G-(I)DLE::I DO": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/64/a0/4f/64a04f8f-2e5c-c0c2-e930-8e6434f2411f/93624850601.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c5/42/54/c54254b8-8989-c2e7-8d95-052dd5bf0562/mzaf_13790743133232346054.plus.aac.p.m4a",
  },
  "TWICE::I Got You": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/83/97/cd/8397cda3-b71b-e78e-0550-581922b6cbed/8809928951904_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f0/0c/44/f00c44dd-c7bb-3d80-cbe2-09e41c30a0a4/mzaf_17736089916737003048.plus.aac.p.m4a",
  },
  "TWICE::What is love?": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/7e/41/69/7e4169e8-8358-27ff-66b4-1564ec800abd/00602508875137_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/c9/67/30/c9673025-135c-e508-571b-122c268d7a28/mzaf_11330238921094968350.plus.aac.p.m4a",
  },
  "TWICE::Fancy": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/03/76/e6/0376e6f9-f6d8-68f7-ae85-1a4ef17002aa/00602508875229_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ca/fe/1d/cafe1df9-e706-1538-bf34-238efafe7f60/mzaf_5940680492365100371.plus.aac.p.m4a",
  },
  "TWICE::Yes or Yes": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/ad/f3/09/adf3092c-d3b6-baaf-9c12-decbb94b28a2/00602508875175_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/25/9c/c3/259cc352-1a9b-4d9e-b785-cb3733362c3f/mzaf_940833290771388937.plus.aac.p.m4a",
  },
  "TWICE::I Can't Stop Me": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1f/46/44/1f46442a-ed5a-7cc8-c119-c6453b559ef7/192641580802_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/93/10/49/931049bb-8e0d-b987-cbf2-407631880911/mzaf_8393986293664874135.plus.aac.p.m4a",
  },
  "TWICE::Moonlight": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/87/f5/e0/87f5e0de-c909-f4e6-9621-123565dfbc80/738676858440_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/48/6f/1f/486f1fb6-bf89-4963-30ff-b3ef3d39c960/mzaf_470065228136326948.plus.aac.p.m4a",
  },
  "TWICE::Last Waltz": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/87/f5/e0/87f5e0de-c909-f4e6-9621-123565dfbc80/738676858440_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bc/38/f2/bc38f202-52eb-a505-3191-2219d0979298/mzaf_14831045232431097212.plus.aac.p.m4a",
  },
  "TWICE::Doughnut": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e2/9e/98/e29e9850-45c1-fd3d-ac26-2d8baaf817d1/190296351020.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/3c/8b/4b/3c8b4b9f-b6f2-3025-6dca-9f08d6dca776/mzaf_6635938556747165894.plus.aac.p.m4a",
  },
  "TWICE::Wallflower": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/8c/cf/96/8ccf96fa-afa3-c039-6e33-d19ae58ae074/738676860610_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/37/ba/ec/37baec30-bdf8-ed02-84db-b0d379e68fa2/mzaf_7098760764223120799.plus.aac.p.m4a",
  },
  "TWICE::Better": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/1d/28/1d/1d281d6a-6acf-a411-913a-c2a303c7fc54/190295097516.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/68/40/05/68400586-15b0-71a3-7b77-444ddc6c156d/mzaf_4267637776201434475.plus.aac.p.m4a",
  },
  "TWICE::Perfect World": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/74/bd/14/74bd14e4-269f-2673-f3f8-80656f7b0c51/190296608483.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c0/b1/17/c0b117dc-aa66-4812-96ab-bb935808f593/mzaf_12706490220884362495.plus.aac.p.m4a",
  },
  "TWICE::SOS": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/d6/02/45/d602455b-23ea-8b81-9ea2-f0931db4a1f9/738676858204_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/1e/a9/93/1ea993df-7681-f128-8013-d5ffb9951228/mzaf_8698977259167522271.plus.aac.p.m4a",
  },
  "TWICE::Cry for Me": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a5/7f/18/a57f181f-fa95-c7ce-4a62-2f1144d1ae3f/192641621130_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/d6/64/85/d6648573-7fb7-3516-8898-b571afea3115/mzaf_6764992212500562255.plus.aac.p.m4a",
  },
  "TWICE::Fake and True": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/2d/b2/d7/2db2d7bb-8d7c-1419-8e6c-d7df03631413/190295329723.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/4e/71/93/4e719341-2313-e56c-98e5-2498dfd5df0f/mzaf_13192806127840946738.plus.aac.p.m4a",
  },
  "TWICE::Breakthrough": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1b/e5/6f/1be56fb0-7e54-59f2-f331-043b811aa28f/190295408145.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/4e/3a/c4/4e3ac439-3cb8-870b-3912-06d7083f58dd/mzaf_14725176508234970320.plus.aac.p.m4a",
  },
  "KPDH::Takedown": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e1/15/42/e1154273-8ecd-5702-e6e6-597f28001681/25UMGIM82363.rgb.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7d/66/d1/7d66d19c-62f0-e9e2-3f92-bb3677d4f736/mzaf_9827808302866808635.plus.aac.p.m4a",
  },
  "KPDH::What it sounds like": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e1/15/42/e1154273-8ecd-5702-e6e6-597f28001681/25UMGIM82363.rgb.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/bc/99/62/bc996219-8b2f-247a-6d54-e4059a220d17/mzaf_15021741184628481038.plus.aac.p.m4a",
  },
  "KPDH::Free": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e1/15/42/e1154273-8ecd-5702-e6e6-597f28001681/25UMGIM82363.rgb.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/62/64/b6/6264b62d-4228-1798-d8f3-8ab2bc3a452b/mzaf_17528719306040428837.plus.aac.p.m4a",
  },
  "ILLIT::Cherish (My Love)": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e9/20/73/e9207332-1b22-18d0-5d1b-daaf370a4317/198704136962_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ff/c5/9d/ffc59d63-bd5d-0b93-4592-2dd7d797de8e/mzaf_7002868842246643213.plus.aac.p.m4a",
  },
  "ILLIT::Tick-Tack": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e9/20/73/e9207332-1b22-18d0-5d1b-daaf370a4317/198704136962_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/68/e9/78/68e978c1-6d32-713d-c91b-836669da6ee3/mzaf_14472264782207748518.plus.aac.p.m4a",
  },
  "ILLIT::Midnight Fiction": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3e/49/1e/3e491e43-4961-21ab-2abe-37fb1c0feb40/196922879227_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/98/ea/3d/98ea3d2a-d5f6-e50c-5e12-0a5f30cb3ef3/mzaf_6385319279090451769.plus.aac.p.m4a",
  },
  "ILLIT::jellyous": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e4/bc/4d/e4bc4da3-0013-9949-8e54-0eede523f9d4/198704525001_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/13/13/20/13132098-7412-2b3b-f54b-5f9515c4a075/mzaf_12702295383222688240.plus.aac.p.m4a",
  },
};

const groupSongFallbacks = {
  IVE: songMetaLibrary["IVE::Rebel Heart"],
  NMIXX: songMetaLibrary["NMIXX::Run for Roses"],
  "LE SSERAFIM": songMetaLibrary["LE SSERAFIM::No Celestial"],
  NewJeans: songMetaLibrary["NewJeans::ETA"],
  VIVIZ: songMetaLibrary["VIVIZ::Untie"],
  aespa: songMetaLibrary["aespa::Whiplash"],
  STAYC: songMetaLibrary["STAYC::Young Luv"],
  "Kiss of Life": songMetaLibrary["Kiss of Life::Midas Touch"],
  BabyMonster: songMetaLibrary["BabyMonster::Hot Sauce"],
  ITZY: songMetaLibrary["ITZY::Ringo"],
  "G-(I)DLE": songMetaLibrary["G-(I)DLE::My Bag"],
  TWICE: songMetaLibrary["TWICE::I Got You"],
  KPDH: songMetaLibrary["KPDH::Free"],
  ILLIT: songMetaLibrary["ILLIT::Cherish (My Love)"],
};

function getSongMeta(groupName, title) {
  const exact = songMetaLibrary[`${groupName}::${title}`];
  const fallback = groupSongFallbacks[groupName] ?? {};

  return {
    title,
    coverImage: exact?.coverImage ?? fallback.coverImage ?? null,
    previewUrl: exact?.previewUrl ?? fallback.previewUrl ?? null,
  };
}

function buildFavoriteSongExtras({ groupName, favorites, wrongSongs }) {
  return favorites.map((favorite, index) => {
    const rotatedWrongSongs = [...wrongSongs.slice(index), ...wrongSongs.slice(0, index)].slice(0, 3);
    const choices = getShuffledChoices(
      [favorite, ...rotatedWrongSongs],
      `${groupName}-${favorite}-favorite-song`,
    );

    return {
      key: `favoriteSong-${slugify(favorite)}`,
      kind: "favoriteSong",
      label: "Which song is one of my favorite songs?",
      answer: favorite,
      previewUrl: getSongMeta(groupName, favorite).previewUrl,
      songChoices: choices.map((songTitle) => getSongMeta(groupName, songTitle)),
      choices,
    };
  });
}

const rounds = [
  {
    id: "lesserafim",
    groupName: "LE SSERAFIM",
    groupChoices: ["LE SSERAFIM", "IVE", "NewJeans", "aespa"],
    members: [
      { name: "Chaewon", image: "/quiz-media/image24.jpg" },
      { name: "Kazuha", image: "/quiz-media/image5.jpg" },
      { name: "Yunjin", image: "/quiz-media/image11.jpg" },
      { name: "Eunchae", image: "/quiz-media/image19.jpg" },
      { name: "Sakura", image: "/quiz-media/image7.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "LE SSERAFIM",
        favorites: ["No Celestial", "Fire in the Belly", "Ash", "HOT", "Swan Song", "Different"],
        wrongSongs: ["ANTIFRAGILE", "Perfect Night", "Smart", "EASY", "Blue Flame", "UNFORGIVEN"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Chaewon",
        choices: ["Chaewon", "Sakura", "Yunjin", "Kazuha"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Eunchae",
        choices: ["Eunchae", "Kazuha", "Chaewon", "Yunjin"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Chaewon",
        choices: ["Chaewon", "Sakura", "Yunjin", "Kazuha"],
      },
    ],
  },
  {
    id: "ive",
    groupName: "IVE",
    groupChoices: ["IVE", "ITZY", "STAYC", "NMIXX"],
    members: [
      { name: "Leeseo", image: "/quiz-media/image20.jpg" },
      { name: "Wonyoung", image: "/quiz-media/image9.jpg" },
      { name: "Rei", image: "/quiz-media/image23.jpg" },
      { name: "Yujin", image: "/quiz-media/image2.jpg" },
      { name: "Liz", image: "/quiz-media/image3.jpg" },
      { name: "Gaeul", image: "/quiz-media/image1.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "IVE",
        favorites: ["Rebel Heart", "Accendio", "Bang Bang", "Baddie", "After Like", "Wave"],
        wrongSongs: ["LOVE DIVE", "I AM", "HEYA", "Kitsch", "Off the Record", "ELEVEN"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Yujin",
        choices: ["Yujin", "Wonyoung", "Rei", "Liz"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Leeseo",
        choices: ["Leeseo", "Liz", "Gaeul", "Yujin"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Wonyoung",
        choices: ["Wonyoung", "Leeseo", "Yujin", "Rei"],
      },
    ],
  },
  {
    id: "nmixx",
    groupName: "NMIXX",
    groupChoices: ["NMIXX", "ITZY", "Kiss of Life", "STAYC"],
    members: [
      { name: "Sullyoon", image: "/quiz-media/image4.jpg" },
      { name: "Haewon", image: "/quiz-media/image27.jpg" },
      { name: "Bae", image: "/quiz-media/image41.jpg" },
      { name: "Lily", image: "/quiz-media/image6.jpg" },
      { name: "Kyujin", image: "/quiz-media/image10.jpg" },
      { name: "Jiwoo", image: "/quiz-media/image22.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "NMIXX",
        favorites: ["Run for Roses", "Blue Valentine", "Shape of Love", "RICO"],
        wrongSongs: ["DASH", "Love Me Like This", "See that?", "O.O", "DICE", "Love Is Lonely"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Haewon",
        choices: ["Haewon", "Lily", "Sullyoon", "Bae"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Kyujin",
        choices: ["Kyujin", "Jiwoo", "Bae", "Sullyoon"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Sullyoon",
        choices: ["Sullyoon", "Haewon", "Lily", "Bae"],
      },
    ],
  },
  {
    id: "illit",
    groupName: "ILLIT",
    groupChoices: ["ILLIT", "NewJeans", "LE SSERAFIM", "IVE"],
    members: [
      { name: "Yunah", image: "/quiz-media/Yunah.jpg" },
      { name: "Minju", image: "/quiz-media/Minju.jpg" },
      { name: "Moka", image: "/quiz-media/Moka.jpg" },
      { name: "Wonhee", image: "/quiz-media/Wonhee.jpg" },
      { name: "Iroha", image: "/quiz-media/Iroha.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "ILLIT",
        favorites: ["Cherish (My Love)", "Tick-Tack", "Midnight Fiction", "jellyous"],
        wrongSongs: ["Magnetic", "Lucky Girl Syndrome", "My World", "Almond Chocolate", "Pimple", "I'll Like You"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "There isnt one",
        choices: ["There isnt one", "Yunah", "Minju", "Wonhee"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Iroha",
        choices: ["Iroha", "Wonhee", "Moka", "Minju"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Wonhee or Iroha",
        choices: ["Wonhee or Iroha", "Yunah", "Minju", "Moka"],
      },
    ],
  },
  {
    id: "itzy",
    groupName: "ITZY",
    groupChoices: ["ITZY", "TWICE", "IVE", "LE SSERAFIM"],
    members: [
      { name: "Ryujin", image: "/quiz-media/image28.jpg" },
      { name: "Chaeryeong", image: "/quiz-media/image26.jpg" },
      { name: "Yuna", image: "/quiz-media/image14.jpg" },
      { name: "Yeji", image: "/quiz-media/image12.jpg" },
      { name: "Lia", image: "/quiz-media/image30.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "ITZY",
        favorites: ["Ringo", "Wannabe", "Mafia in the morning", "Loco", "Untouchable"],
        wrongSongs: ["DALLA DALLA", "Not Shy", "Voltage", "CAKE", "SNEAKERS", "SWIPE"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Yeji",
        choices: ["Yeji", "Ryujin", "Lia", "Yuna"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Yuna",
        choices: ["Yuna", "Chaeryeong", "Lia", "Yeji"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Ryujin",
        choices: ["Ryujin", "Yeji", "Yuna", "Chaeryeong"],
      },
    ],
  },
  {
    id: "stayc",
    groupName: "STAYC",
    groupChoices: ["STAYC", "IVE", "KATSEYE", "NMIXX"],
    members: [
      { name: "J", image: "/quiz-media/image29.jpg" },
      { name: "Seeun", image: "/quiz-media/image35.jpg" },
      { name: "Sumin", image: "/quiz-media/image15.jpg" },
      { name: "Isa", image: "/quiz-media/image40.jpg" },
      { name: "Sieun", image: "/quiz-media/image13.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "STAYC",
        favorites: ["Young Luv", "Bubble", "RUN2U", "Stay WITH me", "Cheeky Icy Thang", "BEBE"],
        wrongSongs: ["ASAP", "Teddy Bear", "Poppy", "Stereotype", "GPT", "SO WHAT"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Sumin",
        choices: ["Sumin", "Sieun", "Isa", "J"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "J",
        choices: ["J", "Seeun", "Sieun", "Sumin"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Isa",
        choices: ["Isa", "J", "Sumin", "Sieun"],
      },
    ],
  },
  {
    id: "katseye",
    groupName: "KATSEYE",
    groupChoices: ["KATSEYE", "VIVIZ", "NewJeans", "BabyMonster"],
    members: [
      { name: "Manon", image: "/quiz-media/image18.png" },
      { name: "Sophia", image: "/quiz-media/image16.jpg" },
      { name: "Yoonchae", image: "/quiz-media/image17.jpg" },
      { name: "Lara", image: "/quiz-media/image33.jpg" },
      { name: "Megan", image: "/quiz-media/image36.jpg" },
      { name: "Daniela", image: "/quiz-media/image31.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "Touch",
        coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/5/55/Katseye_-_SIS_%28Soft_Is_Strong%29.jpeg/250px-Katseye_-_SIS_%28Soft_Is_Strong%29.jpeg",
        sampleVideoId: "l9CZykYZkOQ",
        choices: ["Touch", "Debut", "My Way", "Gnarly"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Sophia",
        choices: ["Sophia", "Lara", "Manon", "Daniela"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Yoonchae",
        choices: ["Yoonchae", "Megan", "Sophia", "Lara"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Sophia",
        choices: ["Sophia", "Manon", "Daniela", "Lara"],
      },
    ],
  },
  {
    id: "aespa",
    groupName: "aespa",
    groupChoices: ["aespa", "IVE", "NewJeans", "ITZY"],
    members: [
      { name: "Giselle", image: "/quiz-media/image42.jpg" },
      { name: "Winter", image: "/quiz-media/image32.jpg" },
      { name: "Karina", image: "/quiz-media/image45.jpg" },
      { name: "Ningning", image: "/quiz-media/image25.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "aespa",
        favorites: ["Whiplash", "Girls", "Drama", "Hold On Tight"],
        wrongSongs: ["Supernova", "Savage", "Spicy", "Armageddon", "Illusion", "Black Mamba"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Karina",
        choices: ["Karina", "Winter", "Giselle", "Ningning"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Ningning",
        choices: ["Ningning", "Winter", "Karina", "Giselle"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Karina",
        choices: ["Karina", "Giselle", "Winter", "Ningning"],
      },
    ],
  },
  {
    id: "newjeans",
    groupName: "NewJeans",
    groupChoices: ["NewJeans", "LE SSERAFIM", "aespa", "KATSEYE"],
    members: [
      { name: "Hanni", image: "/quiz-media/image34.jpg" },
      { name: "Danielle", image: "/quiz-media/image43.jpg" },
      { name: "Minji", image: "/quiz-media/image37.jpg" },
      { name: "Haerin", image: "/quiz-media/image56.jpg" },
      { name: "Hyein", image: "/quiz-media/image55.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "NewJeans",
        favorites: ["ETA", "GODS", "Hype Boy"],
        wrongSongs: ["Ditto", "Super Shy", "OMG", "Attention", "Cookie", "Cool With You"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "No official leader",
        choices: ["No official leader", "Minji", "Hanni", "Danielle"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Hyein",
        choices: ["Hyein", "Haerin", "Minji", "Danielle"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Hanni",
        choices: ["Hanni", "Haerin", "Minji", "Danielle"],
      },
    ],
  },
  {
    id: "gidle",
    groupName: "G-(I)DLE",
    groupChoices: ["G-(I)DLE", "Kiss of Life", "STAYC", "IVE"],
    members: [
      { name: "Yuqi", image: "/quiz-media/image71.jpg" },
      { name: "Miyeon", image: "/quiz-media/image57.jpg" },
      { name: "Soyeon", image: "/quiz-media/image53.jpg" },
      { name: "Minnie", image: "/quiz-media/image39.jpg" },
      { name: "Shuhua", image: "/quiz-media/image59.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "G-(I)DLE",
        favorites: ["My Bag", "Senorita", "Tomboy", "Eyes Roll", "Paradise", "I DO"],
        wrongSongs: ["Queencard", "Nxde", "Super Lady", "LATATA", "Oh my god", "Allergy"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Soyeon",
        choices: ["Soyeon", "Yuqi", "Miyeon", "Minnie"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Shuhua",
        choices: ["Shuhua", "Miyeon", "Yuqi", "Minnie"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Yuqi",
        choices: ["Yuqi", "Miyeon", "Soyeon", "Minnie"],
      },
    ],
  },
  {
    id: "kiss-of-life",
    groupName: "Kiss of Life",
    groupChoices: ["Kiss of Life", "VIVIZ", "NMIXX", "STAYC"],
    members: [
      { name: "Belle", image: "/quiz-media/image52.jpg" },
      { name: "Natty", image: "/quiz-media/image66.jpg" },
      { name: "Julie", image: "/quiz-media/image38.jpg" },
      { name: "Haneul", image: "/quiz-media/image63.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "Kiss of Life",
        favorites: ["Midas Touch", "k bye", "igloo", "Te Quiero", "Tell me"],
        wrongSongs: ["Sticky", "Nobody Knows", "Shhh", "Bad News", "Sugarcoat", "Nothing"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Julie",
        choices: ["Julie", "Belle", "Natty", "Haneul"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Haneul",
        choices: ["Haneul", "Belle", "Natty", "Julie"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Natty",
        choices: ["Natty", "Belle", "Julie", "Haneul"],
      },
    ],
  },
  {
    id: "viviz",
    groupName: "VIVIZ",
    groupChoices: ["VIVIZ", "KATSEYE", "BabyMonster", "aespa"],
    members: [
      { name: "Umji", image: "/quiz-media/image70.jpg" },
      { name: "Eunha", image: "/quiz-media/image47.jpg" },
      { name: "SinB", image: "/quiz-media/image44.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "VIVIZ",
        favorites: ["Untie", "Cliche", "MANIAC"],
        wrongSongs: ["BOP BOP!", "Pull Up", "Rum Pum Pum", "Loveade", "Tweet Tweet", "Overflow"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Eunha",
        choices: ["Eunha", "SinB", "Umji", "No official leader"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Umji",
        choices: ["Umji", "SinB", "Eunha", "No maknae"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "SinB",
        choices: ["SinB", "Eunha", "Umji", "No answer"],
      },
    ],
  },
  {
    id: "babymonster",
    groupName: "BabyMonster",
    groupChoices: ["BabyMonster", "KATSEYE", "Kiss of Life", "NewJeans"],
    members: [
      { name: "Ahyeon", image: "/quiz-media/image58.jpg" },
      { name: "Rami", image: "/quiz-media/image46.jpg" },
      { name: "Rora", image: "/quiz-media/image48.jpg" },
      { name: "Chiquita", image: "/quiz-media/image62.jpg" },
      { name: "Ruka", image: "/quiz-media/image49.jpg" },
      { name: "Pharita", image: "/quiz-media/image68.jpg" },
      { name: "Asa", image: "/quiz-media/image67.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "BabyMonster",
        favorites: ["Hot Sauce", "Psycho", "Sheesh", "Like That", "Billionaire"],
        wrongSongs: ["DRIP", "BATTER UP", "FOREVER", "Really Like You", "CLIK CLAK", "Love In My Heart"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "No official leader",
        choices: ["No official leader", "Ahyeon", "Ruka", "Rami"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Chiquita",
        choices: ["Chiquita", "Rora", "Asa", "Pharita"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Ahyeon",
        choices: ["Ahyeon", "Rami", "Ruka", "Chiquita"],
      },
    ],
  },
  {
    id: "twice",
    groupName: "TWICE",
    groupChoices: ["TWICE", "ITZY", "IVE", "STAYC"],
    members: [
      { name: "Sana", image: "/quiz-media/image64.jpg" },
      { name: "Jihyo", image: "/quiz-media/image75.jpg" },
      { name: "Nayeon", image: "/quiz-media/image73.jpg" },
      { name: "Momo", image: "/quiz-media/image50.jpg" },
      { name: "Mina", image: "/quiz-media/image60.jpg" },
      { name: "Dahyun", image: "/quiz-media/image51.jpg" },
      { name: "Chaeyoung", image: "/quiz-media/image72.jpg" },
      { name: "Jeongyeon", image: "/quiz-media/image54.jpg" },
      { name: "Tzuyu", image: "/quiz-media/image74.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "TWICE",
        favorites: [
          "I Got You",
          "What is love?",
          "Fancy",
          "Yes or Yes",
          "I Can't Stop Me",
          "Moonlight",
          "Last Waltz",
          "Doughnut",
          "Wallflower",
          "Better",
          "Perfect World",
          "SOS",
          "Cry for Me",
          "Fake and True",
          "Breakthrough",
        ],
        wrongSongs: ["Feel Special", "TT", "Talk that Talk", "Dance the Night Away", "The Feels", "Alcohol-Free"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Jihyo",
        choices: ["Jihyo", "Nayeon", "Jeongyeon", "Sana"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Tzuyu",
        choices: ["Tzuyu", "Chaeyoung", "Dahyun", "Mina"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Sana",
        choices: ["Sana", "Jihyo", "Momo", "Nayeon"],
      },
    ],
  },
  {
    id: "kiiikiii",
    groupName: "KiiiKiii",
    groupChoices: ["KiiiKiii", "Meovv", "Hearts2Hearts", "XG"],
    members: [
      { name: "Kya", image: "/quiz-media/Kya.jpg" },
      { name: "Jiyu", image: "/quiz-media/Jiyu.jpg" },
      { name: "Sui", image: "/quiz-media/Sui.jpg" },
      { name: "Haum", image: "/quiz-media/Haum.jpg" },
      { name: "Leesol", image: "/quiz-media/Leesol.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "404 (New Era)",
        choices: ["404 (New Era)", "I Do Me", "Groundwork", "BTG"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Jiyu",
        choices: ["Jiyu", "Kya", "Sui", "Haum"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Kya",
        choices: ["Kya", "Leesol", "Haum", "Sui"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Kya",
        choices: ["Kya", "Jiyu", "Sui", "Leesol"],
      },
    ],
  },
  {
    id: "meovv",
    groupName: "Meovv",
    groupChoices: ["Meovv", "KiiiKiii", "XG", "Baby DONT Cry"],
    members: [
      { name: "Sooin", image: "/quiz-media/Sooin.jpg" },
      { name: "Gawon", image: "/quiz-media/Gawon.jpg" },
      { name: "Anna", image: "/quiz-media/Anna.jpg" },
      { name: "Narin", image: "/quiz-media/Narin.jpg" },
      { name: "Ella", image: "/quiz-media/Ella.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "Burning Up",
        choices: ["Burning Up", "MEOW", "Body", "Hands Up"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "There isn't one",
        choices: ["There isn't one", "Sooin", "Gawon", "Anna"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Ella",
        choices: ["Ella", "Narin", "Anna", "Sooin"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Ella",
        choices: ["Ella", "Gawon", "Anna", "Narin"],
      },
    ],
  },
  {
    id: "hearts2hearts",
    groupName: "Hearts2Hearts",
    groupChoices: ["Hearts2Hearts", "KiiiKiii", "Meovv", "XG"],
    members: [
      { name: "Carmen", image: "/quiz-media/Carmen.jpg" },
      { name: "Jiwoo", image: "/quiz-media/Jiwoo_h2h.jpg" },
      { name: "Yuha", image: "/quiz-media/Yuha.jpg" },
      { name: "Stella", image: "/quiz-media/Stella.jpg" },
      { name: "Juun", image: "/quiz-media/Juun.jpg" },
      { name: "A-na", image: "/quiz-media/A-na.jpg" },
      { name: "Ian", image: "/quiz-media/Ian.jpg" },
      { name: "Ye-on", image: "/quiz-media/Ye-on.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "Rude!",
        choices: ["Rude!", "The Chase", "Butterflies", "Spark"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Jiwoo",
        choices: ["Jiwoo", "Carmen", "Ian", "Yuha"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Ye-on",
        choices: ["Ye-on", "A-na", "Juun", "Ian"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Ian",
        choices: ["Ian", "Jiwoo", "Ye-on", "Carmen"],
      },
    ],
  },
  {
    id: "xg",
    groupName: "XG",
    groupChoices: ["XG", "Hearts2Hearts", "Meovv", "aespa"],
    members: [
      { name: "Chisa", image: "/quiz-media/Chisa.jpg" },
      { name: "Hinata", image: "/quiz-media/Hinata.jpg" },
      { name: "Jurin", image: "/quiz-media/Jurin.jpg" },
      { name: "Harvey", image: "/quiz-media/Harvey.jpg" },
      { name: "Juria", image: "/quiz-media/Juria.jpg" },
      { name: "Maya", image: "/quiz-media/Maya.jpg" },
      { name: "Cocona", image: "/quiz-media/Cocona.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "Hypnotize",
        choices: ["Hypnotize", "WOKE UP", "SHOOTING STAR", "LEFT RIGHT"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Jurin",
        choices: ["Jurin", "Chisa", "Hinata", "Maya"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Cocona",
        choices: ["Cocona", "Juria", "Harvey", "Hinata"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Hinata",
        choices: ["Hinata", "Jurin", "Chisa", "Cocona"],
      },
    ],
  },
  {
    id: "baby-dont-cry",
    groupName: "Baby DONT Cry",
    groupChoices: ["Baby DONT Cry", "Meovv", "KiiiKiii", "Hearts2Hearts"],
    members: [
      { name: "Yihyun", image: "/quiz-media/Yihyun.jpg" },
      { name: "Kumi", image: "/quiz-media/Kumi.jpg" },
      { name: "Mia", image: "/quiz-media/Mia.jpg" },
      { name: "Beni", image: "/quiz-media/Beni.jpg" },
    ],
    extras: [
      {
        key: "favoriteSong",
        label: "What is my favorite song?",
        answer: "I Dont Care",
        choices: ["I Dont Care", "Dream Rush", "Cry Baby", "Glow Up"],
      },
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Yihyun",
        choices: ["Yihyun", "Kumi", "Mia", "Beni"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Beni",
        choices: ["Beni", "Mia", "Kumi", "Yihyun"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Yihyun or Mia",
        choices: ["Yihyun or Mia", "Beni", "Kumi", "Mia"],
      },
    ],
  },
  {
    id: "kpdh",
    groupName: "KPDH",
    groupChoices: ["KPDH", "XG", "Meovv", "Hearts2Hearts"],
    members: [
      { name: "Rumi", image: "/quiz-media/Rumi.jpg" },
      { name: "Zoey", image: "/quiz-media/Zoey.jpg" },
      { name: "Mira", image: "/quiz-media/Mira.jpg" },
    ],
    extras: [
      ...buildFavoriteSongExtras({
        groupName: "KPDH",
        favorites: ["Takedown", "What it sounds like", "Free"],
        wrongSongs: ["Golden", "How It's Done", "Soda Pop", "Your Idol", "Gunshot"],
      }),
      {
        key: "leader",
        label: "Who is the leader?",
        answer: "Rumi",
        choices: ["Rumi", "Zoey", "Mira", "No official leader"],
      },
      {
        key: "maknae",
        label: "Who is the maknae?",
        answer: "Zoey",
        choices: ["Zoey", "Mira", "Rumi", "No maknae"],
      },
      {
        key: "bias",
        label: "Who is my bias?",
        answer: "Zoey",
        choices: ["Zoey", "Rumi", "Mira", "No answer"],
      },
    ],
  },
];

export const mainQuizRounds = rounds.map((round) => {
  const allGroupNames = rounds.map((item) => item.groupName);
  const memberNames = round.members.map((member) => member.name);

  return {
    ...round,
    groupChoices: getShuffledChoices(allGroupNames, `${round.id}-groups`),
    members: round.members.map((member) => ({
      ...member,
      choices: getShuffledChoices(memberNames, `${round.id}-member-${member.name}`),
    })),
    extras: round.extras.map((extra) => {
      if (["leader", "maknae", "bias"].includes(extra.key)) {
        const includesSpecialAnswer = !memberNames.includes(extra.answer);
        const baseChoices = includesSpecialAnswer ? [extra.answer, ...memberNames] : memberNames;

        return {
          ...extra,
          choices: getShuffledChoices(baseChoices, `${round.id}-${extra.key}`),
        };
      }

      return {
        ...extra,
        choices: getShuffledChoices(extra.choices, `${round.id}-${extra.key}`),
      };
    }),
  };
});
