const fs = require('fs');
let content = fs.readFileSync('components/RadioDashView.tsx', 'utf8');

// The unclosed fragment is before <p className="text-xs text-zinc-600 mb-4">
// So I just need to close the fragment right before the </div> that closes the promo section

const target = `                                        Confirm Campaign
                                    </button>
                                </div>
                            )}`;

const replacement = `                                        Confirm Campaign
                                    </button>
                                    </>
                                    )}
                                </div>
                            )}`;

content = content.replace(target, replacement);

fs.writeFileSync('components/RadioDashView.tsx', content);
