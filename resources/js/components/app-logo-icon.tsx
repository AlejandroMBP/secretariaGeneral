import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <div className="h-full w-full bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-900 dark:to-blue-900">
            <img src="/image/logoSecretaria.png" alt="Logo Secretaría" className="h-10 w-auto" />
        </div>
    );
}
