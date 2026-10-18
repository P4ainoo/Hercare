export const IMAGES = {
  bunnyMascot:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA0ilLgyybS0x_McBEYeBLH5J0ENzl-6kvEw4wDw_hAeGKy0WkUJ8bDfFZhIIoNjndoUJtN3BE3G3I0T5_HNxc-A8jLDp9kKPgxQtjPp1iK_V4iBnZaQ1dZCV3JCUoqXNCr0PfFNH1Yybl72R3EypqJy6aWCOimE4f453jZ15vrxWi4N3RX0-7dNNEcIvlXYMFKsn2AUGaQXnymVFOUAixz-9oXcMk3EQVKQoemL9yVr5ygKi-_FqWawg',
  studentDesk:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB4bCKPHiTOSe-MkhomDsmT5sbS4lziT6Xs1C1ncz-VmOGPnWl0Z8a5qOmjIOu7rfWlkMvJE5jLN9Rh-hO56AbEZOLvsC3nqMpd_xmd0q2sNgU-t4BQe1n3zlI83h2DN-aDFLNCma9xJBVyY5svgMc4ByZjHAkTDXxg8V6YGHLz2l2h91cEwFidZKxVT9l3gdPDDixx3Gd3PwcOpzOjhZSNdNyaVxgkkhQjCF7SZzhZLHHTv0gMUGinWA',
  graduateDesk:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDkWn2tsO6KSHles1AfyDCp_tfp9xNwtIPXNmwJ1zXl5X09YR4F3x1iwsY-zDZ-qAglWcGvijALX9iVQY7Nj1NYaVovnrW2QTXbiy3KuRimVi_Pd5DqxXSm0cIlDYZZYeXy-jE4YZTmF0jLp2rZCJzMWHKft2TSLiOAIH2C4t_YjvuWtMZLXHvKUzt8uIFEkACU-jf-FxGk4FXMH_xr-wictrJPohZe7CgD6doKC7iIG339XkKO4IY0Jg',
  guideCatPillow:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuApQxyVOWRinu8Uhy-FNTAm3c8azxB6W9WtxwF_yA9QfLm2lq6_R-Jc7oHNm4pz_b6_hsbeEjdu5HCaTgnSgIEug9RmTuXvf2WfNTKV3alanrsR5tZEy3PhdgkQyzIL1-B2atIKSOkDvkSfpM44wu56Cf6I0mZ2tLwQn4mEe6suvqRQP2DnQPpdiuevXNsQsdmA7d_Ohddvy1WAlOQnNv968cINx58Ac8tjGdNsZcDmeXcnclj6q9H7WQ',
  foxLumi:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB_RJ9Xbdljr5eHeSMRQ6tENAC2B_MFevrHdhSEC8GoRLsbL_TV9va2LEzRNUOqPdD7Wld8nGuhfnFaUktiFuHasaff05M6i78Vt5pw_sDiup4tmW7n7rIYgFBSvyO62akY3clBKmKRM4uj_n3k7Grtsppn1zESd2ISpB3yJq0K51oygWnVBv-azi1ar66CSkPsRndt58YJ3nPZBYiDjoL20IAUCcPPOsXkqxrcdwXRfep93KJqUj3LXw',
  celestialAura:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDhdUCOx2V2cIMAK--IpqHcWoPm53xbh1S9Qt6PjxccEUnF6ylJuzeV6s2MrJ0X0oEmroogYFaOptpxHOR8qruPfcGJ58qz6hgh0E1TDY0CFXqQV_CsxpNyq-wJsgjAN3MfJG1qHpKAXfzN3B-QKvH3yNLP6mtzI6UBef4oaXQkuJwPlFgeeh1SZAqyh23DCt4eplwtpFq7DLAC7SRpJ7m9Y23xPFnXRn1h7Jft4Eh2kokWj1k9icsY2Q'
};

export const COMPANION_OPTIONS = [
  {
    type: 'Bunny-Cat' as const,
    name: 'Bunny',
    trait: 'Calm & Soft',
    quote: 'I’m ready to keep you company and listen warmly.',
    icon: 'cruelty_free',
    image: IMAGES.bunnyMascot
  },
  {
    type: 'Cat' as const,
    name: 'Cat',
    trait: 'Playful & Curious',
    quote: 'Let’s curl up together when deadlines get overwhelming.',
    icon: 'pets',
    image: IMAGES.guideCatPillow
  },
  {
    type: 'Fox' as const,
    name: 'Fox',
    trait: 'Clever & Gentle',
    quote: 'I will cheer you on through every study session.',
    icon: 'psychology_alt',
    image: IMAGES.foxLumi
  },
  {
    type: 'Bear' as const,
    name: 'Bear',
    trait: 'Warm & Grounded',
    quote: 'A soft hug is waiting whenever you need to breathe.',
    icon: 'bedroom_baby',
    image: IMAGES.celestialAura
  },
  {
    type: 'Panda' as const,
    name: 'Panda',
    trait: 'Peaceful & Mindful',
    quote: 'Take it one breath at a time today, you’ve got this.',
    icon: 'self_improvement',
    image: IMAGES.bunnyMascot
  },
  {
    type: 'Baby Dragon' as const,
    name: 'Baby Dragon',
    trait: 'Dreamy & Radiant',
    quote: 'Your dreams are valid, keep shining gently.',
    icon: 'flare',
    image: IMAGES.foxLumi
  }
];
