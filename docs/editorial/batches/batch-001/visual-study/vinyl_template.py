"""Reusable thumbnail layout. The source photograph remains unchanged on disk."""
from html import escape


def vinyl_thumbnail(media, key, prefix=''):
    """Place artwork only over the photographed label; retain the original spindle."""
    reference = escape(prefix + 'references/vinyl-reference.png', quote=True)
    source = escape(media['imageUrl'], quote=True)
    description = escape(media['altText'])
    key = escape(key, quote=True)
    return f'''<svg class="reference-vinyl" viewBox="0 0 1200 1500" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title-{key}" style="display:block;width:100%;height:auto;aspect-ratio:4/5">
      <title id="title-{key}">{description} — shown in the shared vinyl photograph.</title>
      <defs>
        <clipPath id="label-{key}"><ellipse cx="600" cy="751" rx="357" ry="357"/></clipPath>
        <clipPath id="hole-{key}"><circle cx="600.5" cy="750.5" r="27.5"/></clipPath>
        <radialGradient id="paper-{key}" cx="38%" cy="30%" r="82%"><stop offset="0" stop-color="white" stop-opacity=".04"/><stop offset="1" stop-color="black" stop-opacity=".13"/></radialGradient>
      </defs>
      <image class="vinyl-surround" href="{reference}" x="0" y="0" width="1200" height="1500"/>
      <g clip-path="url(#label-{key})">
        <image class="vinyl-cover" href="{source}" x="243" y="394" width="714" height="714" preserveAspectRatio="xMidYMid slice"/>
        <rect x="243" y="394" width="714" height="714" fill="url(#paper-{key})"/>
        <circle cx="600.5" cy="750.5" r="116" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="1.5"/>
        <image class="vinyl-hole" href="{reference}" x="0" y="0" width="1200" height="1500" clip-path="url(#hole-{key})"/>
      </g>
    </svg>'''
