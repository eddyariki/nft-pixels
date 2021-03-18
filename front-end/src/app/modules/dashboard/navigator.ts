
class Navigators {

    goAuction(id: string): string {
        return `auction/${id}`;
    }

    goChangePixel(id: string): string {
        return `change_pixel/${id}`;
    }
}

export const Navigator = new Navigators();
