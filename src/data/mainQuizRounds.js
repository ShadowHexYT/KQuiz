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
  "KiiiKiii::404 (New Era)": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1c/b4/81/1cb481b3-9b5b-83bf-e047-41e3089b0653/199806885123.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ef/d8/84/efd884da-ffb3-dff0-1c53-05ee61d7baa1/mzaf_9160660066743675925.plus.aac.p.m4a",
  },
  "KiiiKiii::Dancing Alone": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f4/d2/b7/f4d2b722-8292-9123-2282-22cb2b54200a/199538356090.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5a/b2/f8/5ab2f87b-4322-f390-f4df-79763e3ebb3c/mzaf_15822948903916161321.plus.aac.p.m4a",
  },
  "KiiiKiii::I Do Me": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7a/ce/99/7ace990a-c596-8988-4917-7687b24c2574/199066585641.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8e/57/4e/8e574e26-8147-8430-6ace-93a8eb7a01d6/mzaf_5228116227050500579.plus.aac.p.m4a",
  },
  "KiiiKiii::Groundwork": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/59/5f/01/595f011c-399f-90d8-27c4-c9f800efae06/199066718230.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/59/7b/0f/597b0f1a-a5b3-0075-d443-5bebf485a408/mzaf_11546670624840672333.plus.aac.p.m4a",
  },
  "KiiiKiii::BTG": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/59/5f/01/595f011c-399f-90d8-27c4-c9f800efae06/199066718230.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ef/57/06/ef57060e-ae26-6bb1-ce53-5700375fe5ef/mzaf_12560240570710042681.plus.aac.p.m4a",
  },
  "KiiiKiii::DEBUT SONG": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/59/5f/01/595f011c-399f-90d8-27c4-c9f800efae06/199066718230.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cf/5e/52/cf5e528a-9c7e-f3bf-1295-7095010995a1/mzaf_2339569964785260765.plus.aac.p.m4a",
  },
  "Meovv::Burning Up": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/da/91/72/da917246-9ee7-2147-1426-d2288d25d662/8800335179325_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7c/9b/c4/7c9bc4ec-87d3-3380-9232-ea0e5b2cd593/mzaf_9058700597149357186.plus.aac.p.m4a",
  },
  "Meovv::Hands Up": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3f/0f/fa/3f0ffaae-0e26-fe64-3c89-8c44bad08320/8800303089540_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/99/a0/2b/99a02b7e-9845-eecc-3ab4-942e97695be3/mzaf_9848700373412010228.plus.aac.p.m4a",
  },
  "Meovv::Drop Top": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a9/7b/56/a97b56c3-984c-cea9-1c05-ed2d190cf495/8800303089526_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/33/0c/87/330c87ca-350a-3021-f721-c4e572bba845/mzaf_4467877248066065410.plus.aac.p.m4a",
  },
  "Meovv::MEOW": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/9b/7f/b9/9b7fb97f-57fd-0a2e-64de-30cd3a259c71/198704128974_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/66/cc/27/66cc271e-8a4f-61d8-f60a-8950c8c7b9fa/mzaf_3451951594926395113.plus.aac.p.m4a",
  },
  "Meovv::Body": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/20/f9/d4/20f9d425-b5c4-cc34-8c2a-2ee2b7155f32/8800287294121_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7b/c0/55/7bc055b8-9023-bb09-6a47-67d19ad6474d/mzaf_17777114812422056918.plus.aac.p.m4a",
  },
  "Meovv::TOXIC": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/20/f9/d4/20f9d425-b5c4-cc34-8c2a-2ee2b7155f32/8800287294121_Cover.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/18/e3/78/18e37822-d33e-592e-aa5c-ad4b31d20857/mzaf_5232793053541043571.plus.aac.p.m4a",
  },
  "Hearts2Hearts::Rude!": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/78/b9/fb/78b9fb30-169a-eab0-38e9-8df725f8f2d6/888735954603.png/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/01/3c/36/013c3684-7121-8f9f-6eb5-00b610ac055c/mzaf_16203782190977593201.plus.aac.p.m4a",
  },
  "Hearts2Hearts::Focus": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/df/26/ea/df26eafa-06e8-8bd0-4180-5ba91fb91c39/888735953859.png/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/97/60/44976097-de99-04ed-b494-11634e957a26/mzaf_5997753821524447019.plus.aac.p.m4a",
  },
  "Hearts2Hearts::Style": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/05/f3/0b/05f30b30-22fb-3c21-c497-8fd8829f2004/888735952135.png/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7d/a5/22/7da52235-4936-089b-cca7-57b39bd57901/mzaf_16582803519496058674.plus.aac.p.m4a",
  },
  "Hearts2Hearts::Spark": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/05/f3/0b/05f30b30-22fb-3c21-c497-8fd8829f2004/888735952135.png/1000x1000bb.jpg",
    previewUrl: null,
  },
  "Hearts2Hearts::The Chase": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2b/0e/e8/2b0ee80e-eae3-aff6-9ca7-01cf7a830c78/888735951398.png/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9d/7f/fb/9d7ffbed-b702-647e-a591-58700fcb4eb8/mzaf_29771823375578786.plus.aac.p.m4a",
  },
  "Hearts2Hearts::Butterflies": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2b/0e/e8/2b0ee80e-eae3-aff6-9ca7-01cf7a830c78/888735951398.png/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c5/e1/d2/c5e1d24b-5ee6-974e-9579-e36a2858c41e/mzaf_15283787365828349651.plus.aac.p.m4a",
  },
  "XG::Hypnotize": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d2/40/bc/d240bc00-1056-57c1-3ec8-cd57f957bcaf/4571694810689.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/61/79/ed/6179ed51-829e-8f66-6d1d-0b2bbc349a76/mzaf_11841702438848777890.plus.aac.p.m4a",
  },
  "XG::Is this love?": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ae/69/ce/ae69ce7b-6007-c83a-f692-93ebfca55449/ANTCD-A0000014930.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b1/af/71/b1af71ea-e159-1e11-1a18-3cfe30f3ec4b/mzaf_9554712132118939602.plus.aac.p.m4a",
  },
  "XG::New Dance": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/9e/a5/4f/9ea54f4c-3d87-eae0-bee8-f9d1d7ef51e5/ANTCD-A0000011283.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cd/b4/12/cdb41207-dbfe-2a26-af67-89d73425d14e/mzaf_15928103081103994062.plus.aac.p.m4a",
  },
  "XG::Left Right": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/f8/4c/0a/f84c0abd-7bab-12ae-d7f0-0e8a9ad8079a/ANTCD-A0000009111.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b2/ec/97/b2ec9767-1b20-6a80-517c-a694b7829c3c/mzaf_5057398466760774373.plus.aac.p.m4a",
  },
  "XG::WOKE UP": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/6b/54/bc/6b54bc75-1878-ae18-3269-e896d64cc08b/ANTCD-A0000013306.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/64/79/bf/6479bffd-f0b6-61ba-88ff-349154fbd829/mzaf_7268471923260701968.plus.aac.p.m4a",
  },
  "XG::SHOOTING STAR": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/f8/4c/0a/f84c0abd-7bab-12ae-d7f0-0e8a9ad8079a/ANTCD-A0000009111.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6a/38/a9/6a38a90c-30dd-a92e-6414-079c4d823b89/mzaf_1680008559214815923.plus.aac.p.m4a",
  },
  "Baby DONT Cry::I Dont Care": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/97/fc/de/97fcdebf-6110-63a7-aa4d-f82306875562/cover_KM0023790_1.jpg/1000x1000bb.jpg",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/d0/b3/7f/d0b37f34-e2c0-c90e-5020-6a8be131d7cb/mzaf_5627744725201999020.plus.aac.p.m4a",
  },
  "Baby DONT Cry::Dream Rush": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/97/fc/de/97fcdebf-6110-63a7-aa4d-f82306875562/cover_KM0023790_1.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "Baby DONT Cry::Cry Baby": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/97/fc/de/97fcdebf-6110-63a7-aa4d-f82306875562/cover_KM0023790_1.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "Baby DONT Cry::Glow Up": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/97/fc/de/97fcdebf-6110-63a7-aa4d-f82306875562/cover_KM0023790_1.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "Baby DONT Cry::Rumor": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/97/fc/de/97fcdebf-6110-63a7-aa4d-f82306875562/cover_KM0023790_1.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "Baby DONT Cry::Fizzy": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/97/fc/de/97fcdebf-6110-63a7-aa4d-f82306875562/cover_KM0023790_1.jpg/1000x1000bb.jpg",
    previewUrl: null,
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
  "BabyMonster::BATTER UP": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/cf/fd/ec/cffdec06-a89b-326f-f897-13a5a7c657f4/BABYMONSTER_BATTER_UP_Cover_4000.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "BabyMonster::CLIK CLAK": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b9/e1/ef/b9e1ef3a-e3eb-8152-e91b-20aca0fc9ffd/BM_DRIP_Digital-Cover_4000.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "BabyMonster::DRIP": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b9/e1/ef/b9e1ef3a-e3eb-8152-e91b-20aca0fc9ffd/BM_DRIP_Digital-Cover_4000.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "BabyMonster::FOREVER": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/5b/2a/86/5b2a8611-2005-2287-1981-9edac10b795b/BABYMONSTER_FORVER.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "BabyMonster::Love In My Heart": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b9/e1/ef/b9e1ef3a-e3eb-8152-e91b-20aca0fc9ffd/BM_DRIP_Digital-Cover_4000.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "G-(I)DLE::Allergy": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7b/59/56/7b59565a-c6bd-a615-9cc2-955cb8481dfb/8804775254703.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "G-(I)DLE::LATATA": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/78/32/0e/78320ee9-3f98-aa6f-8efc-9bf598eabd5b/cover-.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "G-(I)DLE::Nxde": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1b/d6/16/1bd61685-ddd6-e982-c686-61f669354dad/196922202544.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "G-(I)DLE::Oh my god": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/3f/da/3e/3fda3e46-be20-c065-1ae7-341b306b7af3/20UMGIM22107.rgb.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "G-(I)DLE::Queencard": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7b/59/56/7b59565a-c6bd-a615-9cc2-955cb8481dfb/8804775254703.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "G-(I)DLE::Super Lady": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/52/34/27/5234273c-5585-261b-4fc5-b10cfd9bbd71/8804775368240.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "ILLIT::Almond Chocolate": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/2b/be/38/2bbe3800-08d2-c340-af71-b828da918ba6/25UMGIM01018.rgb.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "ILLIT::I'll Like You": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e9/20/73/e9207332-1b22-18d0-5d1b-daaf370a4317/198704136962_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "ILLIT::Lucky Girl Syndrome": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3e/49/1e/3e491e43-4961-21ab-2abe-37fb1c0feb40/196922879227_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "ILLIT::Magnetic": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3e/49/1e/3e491e43-4961-21ab-2abe-37fb1c0feb40/196922879227_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "ILLIT::My World": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3e/49/1e/3e491e43-4961-21ab-2abe-37fb1c0feb40/196922879227_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "ILLIT::Pimple": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e9/20/73/e9207332-1b22-18d0-5d1b-daaf370a4317/198704136962_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "ITZY::CAKE": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/50/e3/e0/50e3e0a3-d11c-d277-de39-a672a258ed4b/8809928950990_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "ITZY::DALLA DALLA": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/b5/83/3f/b5833f11-e5e1-3f65-81f0-a69c5fe09499/192641939532_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "ITZY::Not Shy": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/9f/ee/e2/9feee229-ffe1-6b42-f6d6-363bb27ff57f/192641939587_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "ITZY::SNEAKERS": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/65/86/05/658605e1-1057-c6b7-fdc1-825ae50e6e2c/738676858761_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "ITZY::SWIPE": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/e7/f3/d7/e7f3d7dc-4bf6-e15d-ca28-3105f713e693/192641938573_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "ITZY::Voltage": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/fa/e0/e7/fae0e7f9-99f9-71a8-6680-810a71044fe4/190296193286.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "IVE::ELEVEN": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/63/4a/d3634a37-8dd2-8fc6-d138-895b3d237611/IVE_OnlineCover_fix.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "IVE::HEYA": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/33/6d/b4/336db418-00ea-9570-1aa5-2541c07e582e/198391557965.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "IVE::I AM": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/3a/23/b7/3a23b7f4-0b43-df9d-b7e4-14f992443324/197188335663.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "IVE::Kitsch": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/3a/23/b7/3a23b7f4-0b43-df9d-b7e4-14f992443324/197188335663.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "IVE::LOVE DIVE": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/67/f8/16/67f8164a-bfc2-f29b-e241-800426a968ef/cover_KM0015013_1.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "IVE::Off the Record": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/6c/2e/be/6c2ebe9c-5107-e055-9e93-05a45d0a703b/197189827297.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "KATSEYE::Debut": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ba/35/9d/ba359dae-1ff5-ef52-4327-e7c6b877ca2b/24UMGIM65526.rgb.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "KATSEYE::Gnarly": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e3/1c/8f/e31c8fb1-3450-1959-412d-7874e4465c6c/25UMGIM37397.rgb.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "KATSEYE::My Way": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/08/fb/6a/08fb6a32-8856-f1f4-148b-8959bff0efb0/24UMGIM67773.rgb.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "KATSEYE::Touch": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/08/fb/6a/08fb6a32-8856-f1f4-148b-8959bff0efb0/24UMGIM67773.rgb.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "KPDH::Golden": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e1/15/42/e1154273-8ecd-5702-e6e6-597f28001681/25UMGIM82363.rgb.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "KPDH::How It's Done": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1e/eb/50/1eeb50b9-d3e3-ef81-13d3-9be87ab446a8/25UM1IM35857.rgb.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "KPDH::Soda Pop": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e1/15/42/e1154273-8ecd-5702-e6e6-597f28001681/25UMGIM82363.rgb.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "KPDH::Gunshot": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e1/15/42/e1154273-8ecd-5702-e6e6-597f28001681/25UMGIM82363.rgb.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "KPDH::Your Idol": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e1/15/42/e1154273-8ecd-5702-e6e6-597f28001681/25UMGIM82363.rgb.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "Kiss of Life::Bad News": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/83/40/88/834088da-6387-50e3-a1ad-cc092acdbb65/cover_KM0018390_1.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "Kiss of Life::Nobody Knows": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/83/40/88/834088da-6387-50e3-a1ad-cc092acdbb65/cover_KM0018390_1.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "Kiss of Life::Nothing": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e1/6f/c2/e16fc273-6872-31a0-a667-3e8777da2636/8804775348402.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "Kiss of Life::Shhh": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/da/29/02/da29023d-6e10-bdd2-7415-ffaa1d5bf481/cover_KM0017387_1.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "Kiss of Life::Sugarcoat": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/da/29/02/da29023d-6e10-bdd2-7415-ffaa1d5bf481/cover_KM0017387_1.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "Kiss of Life::Sticky": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9b/00/c7/9b00c7e0-2e78-af06-bcfe-89d7a00e5a6d/cover_KM0019987_1.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "LE SSERAFIM::ANTIFRAGILE": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/c8/79/da/c879dadf-db1e-95a5-caf5-b18c7c81d2b6/192641874413_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "LE SSERAFIM::Blue Flame": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/77/c9/7f/77c97fcc-e72d-13e9-2e41-d5c23ceb5e43/196922016622_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "LE SSERAFIM::EASY": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/22/0f/fd/220ffdbf-152c-5b65-d5af-01256c1328c2/196922796531_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "LE SSERAFIM::Perfect Night": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a0/cd/40/a0cd4013-89cf-0554-0aa5-1ac5a0bb3db1/196922680779_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "LE SSERAFIM::Smart": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/22/0f/fd/220ffdbf-152c-5b65-d5af-01256c1328c2/196922796531_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "LE SSERAFIM::UNFORGIVEN": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/27/13/c3/2713c389-4f01-b5e7-59f5-3204b37cb594/196922444470_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "LE SSERAFIM::Eve, Psyche, and the Bluebeards wife": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/27/13/c3/2713c389-4f01-b5e7-59f5-3204b37cb594/196922444470_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "NMIXX::DASH": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/58/67/42/58674202-0971-b51e-df73-b5695cfadd6e/8809928950259_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "NMIXX::DICE": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/86/27/38/86273818-e315-adec-fe27-c65bb5f9c982/738676860016_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "NMIXX::Love Is Lonely": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/90/76/09/907609f4-0740-9439-f8c9-61e1ae7e8425/8809928952499_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "NMIXX::Love Me Like This": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/4f/92/32/4f9232bc-b05d-b467-edcb-41f39356045f/738676860504_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "NMIXX::O.O": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/01/35/8b/01358bfe-d94d-de1e-3750-6a9e276ffc12/738676858525_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "NMIXX::See that?": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/90/76/09/907609f4-0740-9439-f8c9-61e1ae7e8425/8809928952499_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "NewJeans::Attention": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4e/64/34/4e64344b-3ac6-c503-2c41-257a15401416/192641873096_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "NewJeans::Cookie": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4e/64/34/4e64344b-3ac6-c503-2c41-257a15401416/192641873096_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "NewJeans::Cool With You": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/4b/7e/d34b7e1e-af3b-43b6-2949-7a8c652a1bc9/196922462726_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "NewJeans::Ditto": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/f6/29/42/f629426e-92fe-535c-cbe4-76e70850819b/196922287107_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "NewJeans::OMG": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/48/96/08/4896085e-b550-cb0a-3e5b-1f203521cb82/196922265464_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "NewJeans::Super Shy": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/63/e5/e2/63e5e2e4-829b-924d-a1dc-8058a1d69bd4/196922462702_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "STAYC::ASAP": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ff/f0/44/fff044b5-8d7c-b728-76be-5b214c5fecf0/STAYC_STAYDOM_JPG.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "STAYC::GPT": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a5/98/8c/a5988c68-c82c-f9e5-4d98-07a7b20fc325/cover_KM0020496_1.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "STAYC::Poppy": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/5b/41/0b/5b410b11-0bfd-db80-2413-f2fd99454b5e/22UM1IM26561.rgb.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "STAYC::SO WHAT": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ff/f0/44/fff044b5-8d7c-b728-76be-5b214c5fecf0/STAYC_STAYDOM_JPG.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "STAYC::Stereotype": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/07/9b/27/079b2760-a382-6d95-b43e-2cf4c563c1ce/cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "STAYC::Teddy Bear": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/e2/34/d3e23468-4920-f7b9-e955-322eb98af917/cover_KM0016800_1.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "TWICE::Alcohol-Free": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/d6/02/45/d602455b-23ea-8b81-9ea2-f0931db4a1f9/738676858204_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "TWICE::Dance the Night Away": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/5d/8d/ae/5d8daec6-bf17-9220-6ffb-d69981dd4ef6/00602508874840_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "TWICE::Feel Special": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/75/bb/cc/75bbcc8c-bc12-983b-196f-bb6e355cc978/00602508875281_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "TWICE::TT": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/0e/c5/67/0ec5678b-9070-ac48-f01d-c8af72b92d01/00602508870064_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "TWICE::Talk that Talk": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/6d/80/45/6d8045ba-5b0e-c88a-0736-87fd14665e69/738676859874_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "TWICE::The Feels": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e0/d5/e6/e0d5e67a-9723-4d72-7510-dbf82553ca68/738676858334_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "VIVIZ::BOP BOP!": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0a/3f/53/0a3f5311-0381-c503-2dc5-0a130a0ce370/8804775224782_cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "VIVIZ::Loveade": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f2/35/78/f23578ca-7828-a836-0947-a380dacc9ce4/8804775229657_cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "VIVIZ::Overflow": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/42/5a/20/425a2026-a87d-7e6a-26d9-4159de176762/8804775284434_cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "VIVIZ::Pull Up": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3e/bc/0c/3ebc0c66-2994-0c1b-0f79-40103d343e6e/8804775267154_cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "VIVIZ::Rum Pum Pum": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/ab/f9/4d/abf94dda-fa40-1de4-5ca0-fa75ad4ac1a1/888272107920.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "VIVIZ::Tweet Tweet": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0a/3f/53/0a3f5311-0381-c503-2dc5-0a130a0ce370/8804775224782_cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "aespa::Armageddon": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/50/7e/e0/507ee09f-ccfd-1e3c-af90-ca5e92b1221b/00888735949869_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "aespa::Black Mamba": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/1f/53/e2/1f53e291-df44-bb66-1c29-6e74c2b0eab0/aespa_BlackMamba_final.png/1000x1000bb.jpg",
    previewUrl: null,
  },
  "aespa::Illusion": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/c9/7d/dd/c97ddd34-5962-8cf1-a55c-cf730d3069f5/888735941375.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "aespa::Savage": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/51/f7/85/51f7852b-7602-136b-ac15-8b3878260c64/4000aespa_M01_Savage_DC.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "aespa::Spicy": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/af/2c/6d/af2c6d62-0ebc-2dff-17b3-8eeb2b3986a0/888735943621.jpg/1000x1000bb.jpg",
    previewUrl: null,
  },
  "aespa::Supernova": {
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/50/7e/e0/507ee09f-ccfd-1e3c-af90-ca5e92b1221b/00888735949869_Cover.jpg/1000x1000bb.jpg",
    previewUrl: null,
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
  KiiiKiii: songMetaLibrary["KiiiKiii::404 (New Era)"],
  Meovv: songMetaLibrary["Meovv::Burning Up"],
  Hearts2Hearts: songMetaLibrary["Hearts2Hearts::Rude!"],
  XG: songMetaLibrary["XG::Hypnotize"],
  "Baby DONT Cry": songMetaLibrary["Baby DONT Cry::I Dont Care"],
  ILLIT: songMetaLibrary["ILLIT::Cherish (My Love)"],
};

export function getSongMeta(groupName, title) {
  const exact = songMetaLibrary[`${groupName}::${title}`];
  const fallback = groupSongFallbacks[groupName] ?? {};

  return {
    title,
    coverImage: exact?.coverImage ?? fallback.coverImage ?? null,
    previewUrl: exact?.previewUrl ?? fallback.previewUrl ?? null,
  };
}

function buildFavoriteSongExtras({ groupName, favorites, wrongSongs }) {
  const choices = getShuffledChoices(
    [...favorites, ...wrongSongs],
    `${groupName}-favorite-songs`,
  );

  return [
    {
      key: "favoriteSongs",
      kind: "favoriteSong",
      label: "Which songs are some of my favorites?",
      answer: favorites[0] ?? "",
      answers: favorites,
      songChoices: choices.map((songTitle) => getSongMeta(groupName, songTitle)),
      choices,
    },
  ];
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
        favorites: [
          "No Celestial",
          "Fire in the Belly",
          "Ash",
          "HOT",
          "Swan Song",
          "Different",
          "Eve, Psyche, and the Bluebeards wife",
        ],
        wrongSongs: [
          "ANTIFRAGILE",
          "Perfect Night",
          "Smart",
          "EASY",
          "Blue Flame",
          "UNFORGIVEN",
          "FEARLESS",
          "Impurities",
          "CRAZY",
        ],
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
        wrongSongs: [
          "LOVE DIVE",
          "I AM",
          "HEYA",
          "Kitsch",
          "Off the Record",
          "ELEVEN",
          "Either Way",
          "Blue Blood",
          "Royal",
          "Take It",
        ],
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
        wrongSongs: [
          "DASH",
          "Love Me Like This",
          "See that?",
          "O.O",
          "DICE",
          "Love Is Lonely",
          "Party O'Clock",
          "Roller Coaster",
          "Soñar (Breaker)",
          "BOOM",
        ],
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
        wrongSongs: [
          "Magnetic",
          "Lucky Girl Syndrome",
          "My World",
          "Almond Chocolate",
          "Pimple",
          "I'll Like You",
          "IYKYK",
          "little monster",
        ],
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
        wrongSongs: [
          "DALLA DALLA",
          "Not Shy",
          "Voltage",
          "CAKE",
          "SNEAKERS",
          "SWIPE",
          "ICY",
          "Cheshire",
          "Mr. Vampire",
          "Bet On Me",
          "BORN TO BE",
        ],
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
        wrongSongs: [
          "ASAP",
          "Teddy Bear",
          "Poppy",
          "Stereotype",
          "GPT",
          "SO WHAT",
          "BEAUTIFUL MONSTER",
          "24/7",
          "COMPLEX",
          "FLEXING ON MY EX",
        ],
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
        wrongSongs: [
          "Supernova",
          "Savage",
          "Spicy",
          "Armageddon",
          "Illusion",
          "Black Mamba",
          "Next Level",
          "Better Things",
          "Salty & Sweet",
          "Mine",
        ],
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
        wrongSongs: [
          "Ditto",
          "Super Shy",
          "OMG",
          "Attention",
          "Cookie",
          "Cool With You",
          "How Sweet",
          "Bubble Gum",
          "Hurt",
          "ASAP",
        ],
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
        wrongSongs: [
          "Queencard",
          "Nxde",
          "Super Lady",
          "LATATA",
          "Oh my god",
          "Allergy",
          "Wife",
          "LION",
          "HWAA",
          "HANN (Alone)",
        ],
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
        wrongSongs: [
          "Sticky",
          "Nobody Knows",
          "Shhh",
          "Bad News",
          "Sugarcoat",
          "Nothing",
          "Bye My Neverland",
          "Gentleman",
          "TTG",
          "Get Loud",
        ],
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
        wrongSongs: [
          "BOP BOP!",
          "Pull Up",
          "Rum Pum Pum",
          "Loveade",
          "Tweet Tweet",
          "Overflow",
          "Love Love Love",
          "Vanilla Sugar Killer",
          "Red Sun!",
          "Mirror",
        ],
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
        wrongSongs: [
          "DRIP",
          "BATTER UP",
          "FOREVER",
          "Really Like You",
          "CLIK CLAK",
          "Love In My Heart",
          "Millionaire",
          "Dream",
          "Woke Up In Tokyo",
          "BILLIONAIRE - JP Ver.",
        ],
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
        wrongSongs: [
          "Feel Special",
          "TT",
          "Talk that Talk",
          "Dance the Night Away",
          "The Feels",
          "Alcohol-Free",
          "Like OOH-AHH",
          "CHEER UP",
          "Likey",
          "KNOCK KNOCK",
          "SIGNAL",
          "Heart Shaker",
          "More & More",
          "SCIENTIST",
          "SET ME FREE",
          "ONE SPARK",
          "Hare Hare",
          "Candy Pop",
        ],
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
        choices: ["404 (New Era)", "Dancing Alone", "I Do Me", "Groundwork", "BTG", "DEBUT SONG"],
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
        choices: ["Burning Up", "Hands Up", "Drop Top", "MEOW", "Body", "TOXIC"],
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
        choices: ["Rude!", "Focus", "Style", "The Chase", "Butterflies", "Spark"],
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
        choices: ["Hypnotize", "Is this love?", "New Dance", "Left Right", "WOKE UP", "SHOOTING STAR"],
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
        choices: ["I Dont Care", "Dream Rush", "Cry Baby", "Glow Up", "Rumor", "Fizzy"],
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
        wrongSongs: ["Golden", "How It's Done", "Soda Pop", "Your Idol", "Gunshot", "Howl", "Shadow", "Eclipse"],
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
      if (extra.kind === "favoriteSong" || extra.key.startsWith("favoriteSong")) {
        const shuffledChoices = getShuffledChoices(extra.choices, `${round.id}-${extra.key}`);
        const favoriteAnswers = extra.answers ?? [extra.answer];

        return {
          ...extra,
          kind: "favoriteSong",
          answer: favoriteAnswers[0] ?? extra.answer,
          answers: favoriteAnswers,
          choices: shuffledChoices,
          coverImage: getSongMeta(round.groupName, extra.answer).coverImage,
          previewUrl: null,
          songChoices: shuffledChoices.map((songTitle) => getSongMeta(round.groupName, songTitle)),
        };
      }

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
